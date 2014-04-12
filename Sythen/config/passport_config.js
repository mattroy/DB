//SYTHEN 
//Matt Roy
//CS5200
//Final Project


var LocalStrategy = require('passport-local').Strategy,
	User = require('../schema/user');
	
module.exports = function(passport) {
	
	//set-up persistent login
	passport.serializeUser(function(user, done) {
        console.log("Serialize user " + user.username);
		done(null, user.username);
	});
	
	passport.deserializeUser(function(username, done) {
		User.find({username: username}, function(err, user) {
			done(err, user);
		});
	});
	
	/*Login*/
	passport.use('local-login', new LocalStrategy(
		function(username, password, done) {
			console.log("User: " + username + " is trying to log in");
			User.findOne({"username": username}, function(err, user) {
				
				if(err) {
					console.log("error logging in " + err);
					return done(err);
				}
				
				if(!user) {
					console.log("could not find user " + username);
					return done(null, false);
				}
				
				if(!user.validatePassword(password)) {
					console.log("user " + username + " is not correct password.");
					return done(null, false);
				}
				
				return done(null, user);
				
			});
	}));

	/*Signup*/
	passport.use('local-signup', new LocalStrategy(
		function(username, password, done) {
			console.log("User: " + username + " is trying to sign up");
			User.findOne({"username": username}, function(err, user) {
				
				if(err) {
					console.log("error logging in " + err);
					return done(err);
				}
				
				if(user) {
					console.log("User " + username + " already exists.");
					return done(null, false);
				} else {
					var user = new User({
						username: username,
					});
					user.password = user.getHash(password);
					user.save();
					return done(null, user);
				}
				
				
				return done(null, user);
				
			});
	}));
};