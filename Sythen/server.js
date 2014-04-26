//SYTHEN 
//Matt Roy
//CS5200
//Final Project


//require
var http = require('http'),
    express = require('express'),
	passport = require('passport'),
    service = require("./routing/routing");

//initialize
var app = express();

require('./config/passport_config')(passport);

app.configure(function() {
	app.use(express.cookieParser());
	app.use(express.bodyParser());
    app.use(express.json());
	app.use(express.cookieSession({secret: "asecretkeyforsessions"}	));
	app.use(express.static("./client"));
	app.use(passport.initialize());
	app.use(passport.session());
});


require('./routing/routing')(app, passport);

//start server
app.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function(){
	console.log("Server started.");
});

