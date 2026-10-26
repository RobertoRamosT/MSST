using System.Data;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Data;
using Msst.Backend.Database;
namespace Msst.Backend.Security;

/// <summary>Activación inicial por DBA Windows. No expone HTTP ni recibe contraseñas en argumentos, archivos o variables.</summary>
public static class AdminBootstrapCommand
{
 public static async Task<int> RunAsync(string[] args)
 {
  if(!OperatingSystem.IsWindows()){Console.Error.WriteLine("La activación inicial requiere una consola Windows autorizada.");return 2;}
  var userId=0;var permissions=new List<string>();
  for(var i=1;i<args.Length;i++)
  {
   if(args[i]=="--user-id"&&i+1<args.Length&&int.TryParse(args[++i],out var id)&&id>0)userId=id;
   else if(args[i]=="--permission"&&i+1<args.Length)permissions.Add(args[++i]);
   else{Console.Error.WriteLine("Argumentos no admitidos. Use --bootstrap-admin --user-id <id> --permission <código> (repetible).");return 2;}
  }
  if(userId<=0){Console.Error.WriteLine("Seleccione el identificador real de la cuenta inicial con --user-id.");return 2;}
  try
  {
   var config=new ConfigurationBuilder().AddJsonFile(Path.Combine(AppContext.BaseDirectory,"appsettings.json"),optional:true).AddEnvironmentVariables().Build();
   var database=new SqlServerAotRepository(config);
   var ready=await Call(database,"CHECK",userId,null,null,[]);
   if(!ready.Succeeded||ready.Policy is null||ready.Version is null){Console.Error.WriteLine(ready.Message);return 1;}
   Console.WriteLine($"Cuenta: {ready.UserName} / empresa: {ready.EmpresaId} / identificador: {ready.UserId}");
   var selected=permissions.Distinct(StringComparer.Ordinal).ToArray();
   if(selected.Length==0)
   {
    Console.WriteLine("Seleccione explícitamente los permisos para esta cuenta y repita el comando:");
    foreach(var permission in ready.Permissions??[])Console.WriteLine($"{permission.Code}: {permission.Label}");
    return 2;
   }
   if(selected.Any(code=>!(ready.Permissions??[]).Any(p=>p.Code==code))){Console.Error.WriteLine("La selección contiene un permiso que no está habilitado en el catálogo.");return 2;}
   if(Console.IsInputRedirected){Console.Error.WriteLine("La contraseña debe escribirse en una consola interactiva con entrada oculta.");return 2;}
   Console.Write("Nueva contraseña (entrada oculta): ");var password=ReadSecret(ready.Policy.MaximumLength);
   Console.Write("Confirme la contraseña (entrada oculta): ");var confirmation=ReadSecret(ready.Policy.MaximumLength);
   if(CredentialHasher.Validate(password,confirmation,ready.Policy) is not null){Console.Error.WriteLine("La contraseña y su confirmación deben cumplir la política vigente de longitud, mayúsculas, minúsculas, números y símbolos.");return 2;}
   var hash=new CredentialHasher().Hash(password,ready.Policy);
   var result=await Call(database,"ACTIVATE",userId,ready.Version,hash,selected);
   Console.WriteLine(result.Message);return result.Succeeded?0:1;
  }
  catch(SqlException){Console.Error.WriteLine("No se pudo confirmar la activación en la base configurada. Revise el acceso DBA y consulte el estado antes de reintentar.");return 1;}
  catch(Exception ex)when(ex is InvalidOperationException or IOException or JsonException){Console.Error.WriteLine("La configuración o la consola no permiten confirmar la activación administrativa.");return 1;}
 }
 private static string ReadSecret(int maximumLength)
 {
  var buffer=new StringBuilder();
  while(true)
  {
   var key=Console.ReadKey(intercept:true);
   if(key.Key==ConsoleKey.Enter){Console.WriteLine();return buffer.ToString();}
   if(key.Key==ConsoleKey.Backspace){if(buffer.Length>0){buffer.Length--;Console.Write("\b \b");}continue;}
   if(char.IsControl(key.KeyChar)||buffer.Length>=maximumLength)continue;
   buffer.Append(key.KeyChar);Console.Write('*');
  }
 }
 private static async Task<BootstrapResult> Call(SqlServerAotRepository database,string operation,int userId,string? version,string? passwordHash,string[] permissions)
 {
  await using var connection=database.CreateConnection();await connection.OpenAsync();
  await using var command=new SqlCommand("dbo.usp_Msst_BootstrapV2",connection){CommandType=CommandType.StoredProcedure};
  command.Parameters.AddWithValue("@Operation",operation);command.Parameters.AddWithValue("@UserId",userId);
  command.Parameters.AddWithValue("@ExpectedVersion",(object?)version??DBNull.Value);
  command.Parameters.AddWithValue("@PasswordHash",(object?)passwordHash??DBNull.Value);
  command.Parameters.AddWithValue("@PermissionCodesJson",JsonSerializer.Serialize(permissions,BootstrapJsonContext.Default.StringArray));
  var json=Convert.ToString(await command.ExecuteScalarAsync())??throw new InvalidDataException("BOOTSTRAP_RECEIPT_MISSING");
  return JsonSerializer.Deserialize(json,BootstrapJsonContext.Default.BootstrapResult)??throw new InvalidDataException("BOOTSTRAP_RECEIPT_INVALID");
 }
}
internal sealed record BootstrapPermission(string Code,string Label);
internal sealed record BootstrapResult(bool Succeeded,string Code,string Message,int UserId,int? EmpresaId,string? UserName,string? Version,SecurityPolicy? Policy,BootstrapPermission[]? Permissions);
[JsonSourceGenerationOptions(PropertyNamingPolicy=JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(BootstrapResult))]
[JsonSerializable(typeof(string[]))]
internal partial class BootstrapJsonContext:JsonSerializerContext;
