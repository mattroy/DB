//Service 

//Service functions for Sythen web application.

//Matt Roy
//CS5200
//Final Project

//-------------------------------------------------------------------------------------------------

//require
var mongo = require("mongodb");

//
var Server = mongo.Server,
		Db = mongo.Db,
		BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('sythendb', server);

db.open(function(err, db) {
	if(!err) {
		console.log("Connected to database.");
		db.collection("users", {strict: true}, function(err, collection) {
			if(err) {
				console.log("The users collection does not exist.");
				populateDatabase();
			}
		});
	}
});



/*User Functions*/

//get list of users
exports.allUsers = function(req, res){
	db.collection("users", function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};
	
//get a specific user
exports.getUser = function(req, res) {
	var username = req.params.username;
	console.log("getting username " + username);
	
	db.collection("users", function(err, collection) {
		collection.findOne({"username": username}, function(err, item) {
			res.send(item);
		});
	});
};

exports.createUser  = function() {};
exports.deleteUser = function() {};


exports.allSongs = function(req, res) {
    res.send([{songName: "Song1", songData: "..."},
					{songName: "Song2", songData: "..."}]);
}


//populate some data into the database
function populateDatabase() {
	var users = [
		{
			username: "mroy",
			password: "mroy123"
		},
		{
			username: "user",
			password: "user123"
		}
	];
	
	db.collection("users", function(err, collection) {
		collection.insert(users, {safe: true}, function(err, result) {
			if(err) {
				console.log("Error inserting into the database." + err);
			}
		});
	});
	
}