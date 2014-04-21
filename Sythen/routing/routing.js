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
		LocalStrategy = require("passport-local").Strategy,
		User = require("../schema/user"),
		Song = require("../schema/song"),
		Comment = require("../schema/comment");


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
	
	
	/*Services*///--------------------------------------------------------
	
	/*Users*///--------------------------
	
	app.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			console.log("Found a user " + users[0].username);
			res.send(users);
		});
	});
	
	app.get('/users/:username', function(req, res) {
		User.find({username: req.params.username}, function(err, users) {
			console.log("found a single user" + users[0].username);
			res.send(users);
		});
	});
    
	/*Songs*///----------------------------------
	
	app.post('/songs', function(req, res) {
        var username = req.session.passport.user.username,
                song = new Song({
                    username: username,
                    name: req.body.name,
                    data: req.body.songData
                });
		song.save();
		
	});
	
	app.get('/songs', function(req, res) {
			Song.find({}, function(err, songs) {
				res.send(songs);
			});
	});
    
	
	/*Comments*///-------------------------------
	
    app.post('/comments', function(req, res) {
		var comment;
        
        console.log("Adding a comment for " + req.body.songId + " : " + req.body.user + ":" + req.body.comment);
        
        comment = new Comment({
        
        });
	});
	
}