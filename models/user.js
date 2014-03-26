var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var userSchema = new Schema({
    id   : {type: String, required: true, unique: true},
	user : String,
    name : String,
	email: String,
	password: String
});

var user = mongoose.model('user', userSchema);
      
module.exports = {
  User: user
};
