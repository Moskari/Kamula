var Message = require('../models/message').Message;
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
/*
 * GET home page.
 */

exports.add_message = function(req, res){
  console.log(req.body.message);
  console.log(JSON.stringify(req.body));
  /*
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var messageSchema = new Schema({
    message: String
	//toWhom: ObjectId,
	//fromWhom: ObjectId
  })
  var Message = mongoose.model('Message', messageSchema);
  */
  var message = new Message();
  message.message = req.body.message;
  //message.time = Date.now();
  message.parent = null,
  //message.time = Date,
  //message.toWhom = ObjectId('1234'),
  //message.fromWhom = ObjectId('12345')
  
  message.save(function (err, m) {
    if (err) return console.error(err);
  });
  
  Message.findOne({}, function(err, docs) {
    if(!err) {
	  console.log(docs);
	  res.json(200, docs.toJSON(docs));
	} else {
	  res.json(500, {message: "error"});
	}

  });
  
  //console.log(messages);
  //res.send(messages);
  //res.send(req.body);
  //res.send("message: " + req.body.message);
  //res.render('index', { title: 'Kamula' });
};