//Service 

//Service functions for Sythen web application.

//Matt Roy
//CS5200
//Final Project

//-------------------------------------------------------------------------------------------------

//require

module.exports = function(app, passport) {

	/*Start Database*/
	var 
		mongoose = require("mongoose"),
		LocalStrategy = require("passport-local").Strategy;


	mongoose.connect('mongodb://localhost/sythendb');
	var db = mongoose.connection;

	db.once('open', function() {
		console.log("Connected to database.");
		
	});

	
	/*Routing*/
	
	//return the login page
	app.get('/', function(req, res) {
		res.sendfile("./client/index.html");
	});
	
	//post for logging in a user
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/main',
		failureRedirect: '/'
	}));
	
	//post for signup user
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/main',
		failureRedirect: '/'
	}));
	
	app.get('/logout', function(req, res) {
		console.log("Log out requested.");
		req.logout();
		res.redirect("/");
	});
	
	app.get("/main", function(req, res) {
		res.sendfile("./client/main.html");
	});

	
}