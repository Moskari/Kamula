var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var messageSchema = new Schema({
    id : {type: String, required: true, unique: true},
    message : String,
	parent: ObjectId,
    time : { type: Date, default: Date.now },
    toWhom: ObjectId,
    fromWhom: ObjectId
});
      
var message = mongoose.model('message', messageSchema);
      
module.exports = {
  Message: message
};
