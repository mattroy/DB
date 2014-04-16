//SYTHEN 
//Matt Roy
//CS5200
//Final Project

/*Comment Schema*/

var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	comment: String,
	song_id: String,
	username: String,
	dateMade: {type: Date, default: Date.now()}
});


module.exports = mongoose.model('Comment', commentSchema);