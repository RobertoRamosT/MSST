 
  // Config object to be passed to Msal on creation
var msalConfig = {};

if(window.location.href.includes("/realplaza")){
    msalConfig={
	    auth:{
	        clientId:"dd39d141-dfdb-4f75-a663-9f14c57d0a2b",
	        authority:"https://login.microsoftonline.com/5daabe65-ff53-4336-a448-2f61ecf0b059",
	        redirectURI:"https://www.gosst.io/realplaza/pages/login.html"
	    },
        cache:{
            cacheLocation:"localStorage",storeAuthStateInCookie:true
        }
    };
}else if(window.location.href.includes("/centenario")){
	msalConfig={
        auth:{
		    clientId:"7c49b459-4519-4b1d-b8d7-7f962bab8b51",
		    authority:"https://login.microsoftonline.com/e3bf4980-93a7-432f-a823-e480938a6143",
		    redirectURI:"https://www.gosst.io/centenario/pages/login.html"
		},
	        cache:{
	            cacheLocation:"localStorage",storeAuthStateInCookie:true
	        }
	    };
}else{
    console.log("ESTÁNDAR");
    msalConfig={
        auth:{
            clientId:"ca8da92c-f3a0-4855-86ae-7d0424792d16",
            authority:"https://login.microsoftonline.com/c454edf0-1a82-4629-a698-6963ce7fee98",
            redirectURI:"https://www.gosst.io/sstweb/pages/login.html"
        },
        cache:{
            cacheLocation:"localStorage",storeAuthStateInCookie:true
        }
    };
}

// Add here scopes for id token to be used at MS Identity Platform endpoints.
var loginRequest={
    scopes: ["openid", "profile", "User.Read"],
};
