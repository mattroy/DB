//SYTHEN 
//Matt Roy
//CS5200
//Final Project

//song schema

var mongoose = require("mongoose");

var songSchema = mongoose.Schema({
	username: String,
	name: String,
	plays: Number,
	data: Schema.Types.Mixed,
	dateCreated: {type: Date, default: Date.now()},
	dateUpdated: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Song", songSchema);
	