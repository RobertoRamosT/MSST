var ws = null; 
$(document).ready(function() {
//	openSocket();
});
var webSocket;
var messages = $("#tblMatrices");


function openSocket(){
    // Ensures only one connection is open at a time
    if(webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED){
        writeResponse("WebSocket is already opened.");
        return;
    }
    // Create a new instance of the websocket
    webSocket = new WebSocket("ws://"+location.host+configGlobal.rutaBack+"/socket/iperc");
     
    /**
     * Binds functions to the listeners for the websocket.
     */
    webSocket.onopen = function(event){
        if(event.data === undefined)
            return;
 
    };

    webSocket.onmessage = function(event){
    	 
    	var response = JSON.parse(event.data);
    	 
        switch(response.accion){
        case "insert":      	 
        	$("#tblMatrices tbody").append("<div class='socket'>Alguien está creando un Iperc</div>")
        	break;
        case "success":
        	listarIPERCs();
        	removeAllSocketDivs();
        	break;
        case "edit":
        	 console.log($("#tdm"+response.id ))
        	$("#tblMatrices #trm"+response.id +"").attr("onclick","").removeClass("info").css({
        		 
        		"border":"black 2px solid",
        		"color":"white"
        	});
        	 $("#tblMatrices #trm"+response.id +" #tdm"+response.id).css({
        		"background-color":"black" 
        	}).html("Un usuario está trabajando con este IPERC");
        	break;
        };
    };

    webSocket.onclose = function(event){
        messages.innerHTML += "<br/>" + "Connection closed";
    };
}

/**
 * Sends the value of the text input to the server
 */
function sendImage(){
    var file = document.getElementById("imageinput").files[0];

    var reader = new FileReader();
    // Builds a JSON object for the image and sends it
    reader.onloadend = function(){
        var json = JSON.stringify({
            "type":"image",
            "data":reader.result
        });
        webSocket.send(json);
    };
    // Make sure the file exists and is an image
    if(file && file.type.match("image")){
        reader.readAsDataURL(file);
    }
}

function sendText(objectSocket){
    var json = JSON.stringify({
        "type":"text",
        "accion":objectSocket.accion,
        "data":objectSocket.id,
        "id":objectSocket.id
    });
    //webSocket.send(json);
}

function closeSocket(){
   // webSocket.close();
}

function writeResponse(json){
   
    var response = JSON.parse(json);
    var output;
   
    // Determine the type of message recieved and handle accordingly
    switch (response.type){
        case "image":
            output = "<img src=\'" + response.data + "\'/>";
            break;
        case "text":
            output = response.data;
            break;
    }

   
}
 
function removeAllSocketDivs(){
	$(".socket").remove();
}