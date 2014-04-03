var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var userSchema = new Schema({
	user : String,
    name : String,
	email: String,
	password: String,
	friends: { type : Array , "default" : [] }
});

var user = mongoose.model('user', userSchema);
      
module.exports = {
  User: user
};
