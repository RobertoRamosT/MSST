namespace Msst.Backend.Security;

/// <summary>Evita publicar claves o evidencias mediante una raíz estática, incluyendo enlaces del sistema de archivos.</summary>
internal static class PrivateStoragePaths
{
 public static string Required(IConfiguration config,string setting)
 {
  var configured=config[setting];
  if(string.IsNullOrWhiteSpace(configured)||!Path.IsPathFullyQualified(configured))
   throw new InvalidOperationException($"Configure {setting} como una carpeta absoluta privada.");
  var path=Canonical(configured);
  var publicRoots=new[]{config["Web:FrontendRoot"],Path.Combine(AppContext.BaseDirectory,"wwwroot"),Path.Combine(Directory.GetCurrentDirectory(),"wwwroot")};
  foreach(var publicRoot in publicRoots)
   if(!string.IsNullOrWhiteSpace(publicRoot)&&Overlaps(path,Canonical(publicRoot)))
    throw new InvalidOperationException($"{setting} debe estar separado de las carpetas públicas.");
  var otherSetting=setting=="Evidence:RootPath"?"Security:DataProtectionKeysPath":"Evidence:RootPath";
  var other=config[otherSetting];
  if(!string.IsNullOrWhiteSpace(other)&&Path.IsPathFullyQualified(other)&&Overlaps(path,Canonical(other)))
   throw new InvalidOperationException("Las evidencias y las claves de sesión deben utilizar carpetas privadas separadas.");
  return path;
 }
 private static bool Overlaps(string first,string second)=>Inside(first,second)||Inside(second,first);
 private static bool Inside(string candidate,string parent)=>string.Equals(candidate,parent,StringComparison.OrdinalIgnoreCase)||candidate.StartsWith(parent+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase);
 private static string Canonical(string path)
 {
  var full=Path.GetFullPath(path);var parts=new Stack<string>();var current=new DirectoryInfo(full);
  while(!current.Exists&&current.Parent is not null){parts.Push(current.Name);current=current.Parent;}
  var resolved=current.ResolveLinkTarget(returnFinalTarget:true)?.FullName??current.FullName;
  while(parts.TryPop(out var part))resolved=Path.Combine(resolved,part);
  // Resuelve enlaces intermedios aun cuando la carpeta final no sea un enlace.
  var root=Path.GetPathRoot(resolved)??throw new InvalidOperationException("La carpeta privada no tiene raíz.");
  var cursor=root;
  foreach(var part in resolved[root.Length..].Split(Path.DirectorySeparatorChar,StringSplitOptions.RemoveEmptyEntries))
  {
   cursor=Path.Combine(cursor,part);var entry=new DirectoryInfo(cursor);
   if(entry.Exists)cursor=entry.ResolveLinkTarget(returnFinalTarget:true)?.FullName??cursor;
  }
  return Path.TrimEndingDirectorySeparator(Path.GetFullPath(cursor));
 }
}
