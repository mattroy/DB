//Service 

//Service functions for Sythen web application.

//Matt Roy
//CS5200
//Final Project

//-------------------------------------------------------------------------------------------------

function authenticate(req, res) {
    console.log("Authenticating");
    if(!req.session.passport.user) {
        res.status(401).send("Not authorized.");
        return false;
    } else { 
        return true;
    }
}

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
        if(req.session.passport.user) {
            res.sendfile("./client/main.html");
        } else {
            res.sendfile("./client/index.html");
        }
	});
	
	
	/*Services*///--------------------------------------------------------
	
	/*Users*///--------------------------
	
	app.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			console.log("Found a user " + users[0].username);
            if(authenticate(req, res)) {
                res.send(users);
            }
		});
	});
	
	app.get('/users/:username', function(req, res) {
		User.find({username: req.params.username}, function(err, users) {
			console.log("found a single user" + users[0].username);
			if(authenticate(req, res)) {
                res.send(users);
            }
		});
	});
    
    app.get('/currentUser', function(req, res) {
        console.log("Looking for user " + req.session.passport.user);
        User.find({username: req.session.passport.user}, function(err, users) {
            console.log("The current user is " + users[0].username);
            if(authenticate(req, res)) {
                res.send(users[0]);
            }
        });
    });
    
    app.put('/users/:username', function(req, res) {
        if(!authenticate(req, res)) {
            return;
        }
        console.log("Updating user " + req.params.username);
        
        User.find({username: req.params.username}, function(err, users) {
            users[0].profilePic = req.body.profilePic;
            users[0].save();
            res.send("ok");
        });
    });
    
	/*Songs*///----------------------------------
	
	app.post('/songs', function(req, res) {
        if(!authenticate(req, res)) {
            return;
        }
        
        console.log("Saving song " + req.body.name);
        var username = req.session.passport.user,
                song = new Song({
                    username: username,
                    name: req.body.name,
                    data: req.body.songData,
                    shared: req.body.shared
                });
		song.save();
		res.send(song);
	});
	
	app.get('/songs', function(req, res) {
        if(!authenticate(req, res)) {
            return;
        }
        Song.find({$or: [{username: req.session.passport.user}, {shared: "Public"}]}, function(err, songs) {
            if(err) {
                console.error(err);
            }
            res.send(songs);
        });
	});
    
    app.put("/songs/:id", function(req, res) {
        if(!authenticate(req, res)) {
            return;
        }
        Song.find({_id: req.params.id}, function(err, songs) {
            songs[0].shared = req.body.shared;
            songs[0].name = req.body.name;
            
            songs[0].save();
        });
    });
	
	/*Comments*///------------------------------
    app.post('/comments', function(req, res) {
		var comment;
        
        if(!authenticate(req, res)) {
            return;
        }
        
        console.log("Adding a comment for " + req.body.song + " : " + req.body.user + ":" + req.body.comment);
        
        comment = new Comment({
            songId: req.body.song,
            comment: req.body.comment,
            username: req.body.user
        });
        
        comment.save();
        res.send("ok");
	});
    
    app.get('/comments/:id', function(req,res) {
        if(!authenticate(req, res)) {
            return;
        }
        console.log("Requesting comments for id: " + req.params.id);
        
        Comment.find({songId: req.params.id}).sort({dateMade: 'desc'}).find(function(err, comments) {
            res.send(comments);
        });
    });
    
    app.delete("/comments/:id", function(req, res) {
        console.log("remove a comment.");
        Comment.find({_id: req.params.id}, function( err, comments) {
                comments[0].remove();
                res.send("ok");
        });
    });
    
}





