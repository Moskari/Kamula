/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var userSchema = new Schema({
	user : String,
    name : String,
	email: String,
	password: String,
	friends: [String],
	active : Boolean
});

var user = mongoose.model('user', userSchema);
      
module.exports = {
  User: user
};
