var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var userSchema = new Schema({
    nickname : String,
    firstname : String,
    lastname: String,
	email: String,
	password: String
});
      
var user = mongoose.model('user', userSchema);
      
module.exports = {
  User: user
};
