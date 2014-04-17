//SYTHEN 
//Matt Roy
//CS5200
//Final Project

/*User Schema*/

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	dateJoined: {type: Date, default: Date.now()},
	profilePic: {type: String, default: "images/user.png"}
});


//get the hash of a given password
userSchema.methods.getHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8),  null);
};

//check if a given password is valid
userSchema.methods.validatePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', userSchema);

	