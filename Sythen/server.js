//SYTHEN 
//Matt Roy
//CS5200
//Final Project


//require
var http = require('http'),
    express = require('express'),
    service = require("./routing/routing");

//service routing
var app = express();
app.get("/users", service.allUsers);
app.get("/users/:username", service.getUser);
app.post("/users/", service.createUser);
app.delete("/users/:username", service.deleteUser);

app.get("/songs", service.allSongs);


//create a server
var server = http.createServer(function(req, res){
    res.writeHead(200, {"Content-type": "text/plain"});
    res.end("Hello World");
});


app.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function(){
//   var addr = server.address();
//   console.log("Chat server listening at", addr.address + ":" + addr.port);
});