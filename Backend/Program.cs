if(args.Length>0 && args[0]=="--bootstrap-admin")
    return await Msst.Backend.Security.AdminBootstrapCommand.RunAsync(args);
var app = Msst.Backend.ApplicationV2.Build(args);
await app.RunAsync();
return 0;
