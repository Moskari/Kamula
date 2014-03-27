var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var messageSchema = new Schema({
    message : String,
	type : String,
	parent: String, //Id to an update to which is replied. Used when message is a comment. "" when message is an user update
    time : { type: Date, default: Date.now },
    toWhom: String, // Id is user's name. "" when message is sent to yourself as an update
    fromWhom: String // Id is user's name. "" when message is sent to yourself as an update
});
      
var message = mongoose.model('message', messageSchema);
      
module.exports = {
  Message: message
};
