var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var userSchema = new Schema({
    nickname : String,
    firstname : String,
    lastname: String
});
      
var user = mongoose.model('message', userSchema);
      
module.exports = {
  User: user
};
