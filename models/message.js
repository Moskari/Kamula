/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var messageSchema = new Schema({
    message : String,
	type : String,
	parent: String, //Id to an update to which is replied. Used when message is a comment. "" when message is an user update
    time : { type: Date, default: Date.now },
    toWhom: String, // Id is receiver's name. 
    fromWhom: String // Id is sender's name. 
});
      
var message = mongoose.model('message', messageSchema);
      
module.exports = {
  Message: message
};
