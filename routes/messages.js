var Message = require('../models/message').Message;
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
  message.save(function (err, m) {
    if (err) return console.error(err);
  });
  
  Message.findOne({}, function(err, docs) {
    if(!err) {
	  console.log(docs);
	  res.json(200, {message: docs.toJSON(docs)});
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