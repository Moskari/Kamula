var mongoose = require('mongoose');
var Schema = mongoose.Schema;
      
var messageSchema = new Schema({
    message : String
});
      
var message = mongoose.model('message', messageSchema);
      
module.exports = {
  Message: message
};
