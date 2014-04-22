//SYTHEN 
//Matt Roy
//CS5200
//Final Project

/*Comment Schema*/

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	comment: String,
	songId: String,
	username: String,
	dateMade: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('Comment', commentSchema);