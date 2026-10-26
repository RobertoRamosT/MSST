using Microsoft.Extensions.Configuration;
using System.Data;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using Msst.Backend.Database;
using Msst.Backend.Workflow;
var checks=new List<Check>();
void Assert(string name,bool pass,string? observed=null){checks.Add(new(name,pass,observed));if(!pass)throw new Exception(name);}
string ConvertConfig(string text)=>SqlConnection.FromConfiguration(new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string,string?>{
 ["ConnectionStrings:MsstSqlServer"]=text,["Database:OdbcDriver"]="ODBC Driver 17 for SQL Server"}).Build());
string Value(string text,string name){var values=new System.Data.Common.DbConnectionStringBuilder{ConnectionString=text};return Convert.ToString(values[name])!.Trim('{','}');}
foreach(var input in new[]{"Driver={ODBC Driver 17 for SQL Server};Server=localhost;Trusted_Connection=Yes;","Server=localhost;Integrated Security=true;"}){
 var normalized=ConvertConfig(input);Assert("TLS_defaults_both_formats",Value(normalized,"Encrypt")=="Yes"&&Value(normalized,"TrustServerCertificate")=="No");
}
foreach(var value in new[]{"true","TRUE"," yes ","SSPI"})Assert("Integrated_"+value.Trim(),Value(ConvertConfig("Server=localhost;Integrated Security="+value+";"),"Trusted_Connection")=="Yes");
foreach(var value in new[]{"false","no"})Assert("Integrated_"+value,Value(ConvertConfig("Server=localhost;Integrated Security="+value+";"),"Trusted_Connection")=="No");
try{ConvertConfig("Server=localhost;Integrated Security=maybe;");Assert("Invalid_boolean_rejected",false);}catch(InvalidOperationException){Assert("Invalid_boolean_rejected",true);}
var quoted=ConvertConfig("Driver={ODBC Driver 17 for SQL Server};Server=localhost;Pwd={a}}b;c};Trusted_Connection=No;");
Assert("ODBC_semicolon_brace_preserved",quoted.Contains("PWD={a}}b;c}"));
Assert("SqlClient_quoted_password_preserved",ConvertConfig("Server=localhost;Password=\"a;b\";Integrated Security=no;").Contains("PWD={a;b}"));
try{ConvertConfig("Server=localhost;Data Source=other;Integrated Security=yes;");Assert("Duplicate_alias_rejected",false);}catch(InvalidOperationException){Assert("Duplicate_alias_rejected",true);}
try{ConvertConfig("Server=localhost;Encrypt=Strict;Integrated Security=yes;");Assert("Strict_not_supported_17_rejected",false);}catch(InvalidOperationException){Assert("Strict_not_supported_17_rejected",true);}
Assert("Strict_18_allowed",Value(ConvertConfig("Driver={ODBC Driver 18 for SQL Server};Server=localhost;Encrypt=Strict;Trusted_Connection=Yes;"),"Encrypt")=="Strict");
var minimal=JsonSerializer.Deserialize("{\"succeeded\":true,\"code\":\"WF_DETAIL_READY\",\"httpStatus\":200}",WorkflowV2JsonContext.Default.WorkflowV2Envelope)!;
Assert("Workflow_source_generated_defaults",minimal.Cases is {Length:0}&&minimal.Expedientes is {Length:0}&&minimal.Subjects is {Length:0}&&minimal.ValidationErrors is {Length:0});
using(var serialized=JsonDocument.Parse(JsonSerializer.Serialize(minimal,WorkflowV2JsonContext.Default.WorkflowV2Envelope)))
 Assert("Workflow_empty_collections_serialized",new[]{"cases","expedientes","subjects","validationErrors"}.All(name=>serialized.RootElement.GetProperty(name).ValueKind==JsonValueKind.Array));
var configured=Environment.GetEnvironmentVariable("MSST_TEST_SQL_CONNECTION");
if(string.IsNullOrWhiteSpace(configured)){
 Console.WriteLine(JsonSerializer.Serialize(new Envelope("SQL_NO_EJECUTADO",false,checks),ProbeJsonContext.Default.Envelope));
 Console.WriteLine("Para las pruebas SQL configure MSST_TEST_SQL_CONNECTION hacia una base MSST_QA_.");return;
}
await using var connection=new SqlConnection(ConvertConfig(configured));await connection.OpenAsync();
string database;
await using(var db=new SqlCommand("SELECT DB_NAME();",connection))database=Convert.ToString(await db.ExecuteScalarAsync())??"";
if(!database.StartsWith("MSST_QA_",StringComparison.Ordinal))throw new InvalidOperationException("Las regresiones SQL requieren una base MSST_QA_.");
await using(var cmd=new SqlCommand("sys.sp_executesql",connection){CommandType=CommandType.StoredProcedure}){
 cmd.Parameters.Add("@stmt",SqlDbType.NVarChar,-1).Value="SET @value=0x0102030405060708;";
 cmd.Parameters.Add("@params",SqlDbType.NVarChar,-1).Value="@value varbinary(8) OUTPUT";
 var output=cmd.Parameters.Add("@value",SqlDbType.VarBinary,8);output.Direction=ParameterDirection.Output;
 await cmd.ExecuteNonQueryAsync();Assert("Binary_output_exact8",output.Value is byte[] bytes&&bytes.SequenceEqual(new byte[]{1,2,3,4,5,6,7,8}));
}
await using(var cmd=new SqlCommand("sys.sp_executesql",connection){CommandType=CommandType.StoredProcedure}){
 cmd.Parameters.Add("@stmt",SqlDbType.NVarChar,-1).Value="SET @value=NULL;";
 cmd.Parameters.Add("@params",SqlDbType.NVarChar,-1).Value="@value varbinary(8) OUTPUT";
 var output=cmd.Parameters.Add("@value",SqlDbType.VarBinary,8);output.Direction=ParameterDirection.Output;
 await cmd.ExecuteNonQueryAsync();Assert("Binary_output_null",output.Value is DBNull);
}
await using(var cmd=new SqlCommand("sys.sp_executesql",connection){CommandType=CommandType.StoredProcedure}){
 cmd.Parameters.Add("@stmt",SqlDbType.NVarChar,-1).Value="SET @value=REPLICATE(N'Ñ',255);";
 cmd.Parameters.Add("@params",SqlDbType.NVarChar,-1).Value="@value nvarchar(255) OUTPUT";
 var output=cmd.Parameters.Add("@value",SqlDbType.NVarChar,255);output.Direction=ParameterDirection.Output;
 await cmd.ExecuteNonQueryAsync();Assert("Unicode_output_exact_capacity",output.Value as string==new string('Ñ',255));
}
foreach(var query in new[]{"WAITFOR DELAY '00:00:04'; SELECT 1;","SELECT 1; WAITFOR DELAY '00:00:04'; SELECT 2;"}){
 using var cts=new CancellationTokenSource(TimeSpan.FromMilliseconds(200));var watch=Stopwatch.StartNew();
 try{await using var cmd=new SqlCommand(query,connection);await cmd.ExecuteScalarAsync(cts.Token);Assert("Cancellation",false);}
 catch(OperationCanceledException){Assert("Cancellation_preserved",watch.ElapsedMilliseconds<2000,watch.ElapsedMilliseconds+"ms");}
}
await using(var cmd=new SqlCommand("SELECT 1;",connection))Assert("Connection_usable_after_cancellation",Convert.ToInt32(await cmd.ExecuteScalarAsync())==1);
var result=new Envelope(database,false,checks);
var json=JsonSerializer.Serialize(result,ProbeJsonContext.Default.Envelope);
var outputDirectory=Environment.GetEnvironmentVariable("MSST_TEST_OUTPUT");
if(!string.IsNullOrWhiteSpace(outputDirectory)){Directory.CreateDirectory(outputDirectory);await File.WriteAllTextAsync(Path.Combine(outputDirectory,"native-odbc.json"),json);}
Console.WriteLine(json);
public sealed record Check(string Name,bool Passed,string? Observed);
public sealed record Envelope(string Database,bool ProductionWrites,List<Check> Checks);
[JsonSerializable(typeof(Envelope))]internal partial class ProbeJsonContext:JsonSerializerContext;
