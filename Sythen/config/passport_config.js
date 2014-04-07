//SYTHEN 
//Matt Roy
//CS5200
//Final Project


var LocalStrategy = require('passport-local').Strategy,
	User = require('../schema/user');
	
module.exports = function(passport) {
	
	//set-up persistent login
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
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

};