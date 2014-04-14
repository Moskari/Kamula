/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

/* This is the REST api for Kamula */

var express = require('express');

var User = require('./models/user').User;
var Message = require('./models/message').Message;
var mongoose = require('mongoose');

var funcs = require('./functions'); // Useful functions

var db = mongoose.connection;
db.once('open', function() {
  console.log("Connected to mongodb");
});


/* 
POST /api/users/ {"user" : "D4RTV4D3R", "name" : "Petteri", "email" : "aaasd@asddd.asd", "password" : "111"} 
*/


function api_register_user(req, res) {
  var msg = "";
  var user = new User();
  console.log(req);
  User.findOne({user : req.body.user}, function(err, docs) {
    if(!err && !docs) {
	  console.log(req.body);
	  if (!funcs.check_string_chars(req.body.user) || !funcs.check_string_length(req.body.user, 99999)) {
	    msg = 'Bad username! ';
	  }
	  user.user = req.body.user;
	  
      if (!funcs.check_string_length(req.body.name, 30)) {
	    msg = msg + 'Bad name! ';
	  }
	  user.name = req.body.name;
	  
      if (!req.body.email) {
	    msg = msg + 'Bad email! ';
	  }
	  user.email = req.body.email;
	  
	  if (!req.body.password) {
		msg = msg + 'Bad password! ';
	  }
	  user.password = req.body.password;
	  
	  user.friends = new Array();
	  user.active = true; // Make user active (not deleted)
	  if (msg) {
	    res.json(400, { message : msg});
	  } else {
      user.save(function (err, m) {
        if (!err) {
          console.error(err);
          res.setHeader('Location', '/api/users/'+req.body.user);
          res.json(201,{message: 'New user ' + user.user + ' registered'});
        } else {
          res.json(500,{message: 'Problem with registering new user'});
        }
      });
	  }
	} else if(!err) {
	  res.json(403, {message : 'Username exists!'});
	} else {
	  res.json(500, {message: "error"});
	}
  });
}


/* 
PUT /api/users/:name {"name" : "Petteri", "email" : "aaasd@asddd.asd", "password" : "111"} 
*/
function api_change_user(req, res) {
  var username = req.param('name');
  console.log(req.body.name);
  User.findOne({user : username}, function(err, user) {
    if(!err && !user) {
		res.json(404,{message: 'User ' + username + 'does not exist.'});
	}
	
	authentication_middleware(req, res, function() {
		console.log(req.user + ' ' + username);
		
		if (req.user != username) {
			res.json(403, {message : 'You don\'t have the rights to change this profile.'});
		} else {
		  var length = 30;
		  if (!funcs.check_string_length(req.body.name, length)) {
			res.json(400, {message: 'Too long name.'});
		  }
		  user.name = req.body.name;
		  user.email = req.body.email;
		  //user.friends = req.body.friends;
		  if (req.body.password) {
			user.password = req.body.password;
		  }
		  
		  
		  user.save(function (err, m) {
			if (!err) {
			  console.error(err);
			  res.json(200,{message: 'User ' + user.user + ' information changed succesfully'});
			} else {
			  res.json(500,{message: 'Problem with changing user profile.'});
			}
		  });
		  
		} 
	});
  });
}


/* 
DELETE /api/users/:name 
*/
function api_delete_user(req, res) {
  var username = req.param('name');
  console.log(req.body.name);
  User.findOne({user : username}, function(err, user) {
    if(!err && !user) {
		res.json(404,{message: 'User ' + username + 'does not exist.'});
	}
	
	authentication_middleware(req, res, function() {
		console.log(req.user + ' ' + username);
		
		if (req.user != username) {
			res.json(403, {message : 'You don\'t have the rights to delete this profile.'});
		} else {

		  user.active = false;		  
		  
		  user.save(function (err, m) {
			if (!err) {
			  console.error(err);
			  res.json(200,{message: 'User ' + user.user + ' deleted succesfully'});
			} else {
			  res.json(500,{message: 'Problem with deleting user profile.'});
			}
		  });
		  
		} 
	});
  });
}


/* 
POST /api/users/:name {name : "Petteri", email : "asd@asd.asd", password : "aaa"} 
*/
function api_add_message(req, res){
  console.log(req.body.message);
  console.log(JSON.stringify(req.body));
  
  var data = req.body;
  var message = new Message();
  if (!funcs.check_string_length(data.message, 200)) {
    res.json(400, {message : "Invalid message length!"});
  } else {

    message.message = data.message;
    message.type = data.type;
    message.parent = data.parent;
	
	// Find the user's friends and check that receiver is a friend
	User.findOne({user : req.user}, 'friends', function(err, user) {
		if(!err && user) {
			// Check that the sender is receiver's friend or sender is sending himself a message (when message type is update)
			if (req.user == data.toWhom || user.friends.indexOf(data.toWhom) >= 0) {
				if (data.type == "update")
					message.toWhom = req.user;
				else if (data.type == "comment")
					message.toWhom = data.toWhom;
				if (data.type == "comment" || data.type == "update") {
				message.fromWhom = req.user;
				
				// Save received message
				message.save(function (err, m) { 
				  if (err) return console.error(err);
				  // Return created message as JSON
				  Message.findOne({_id : message._id}, function(err, docs) {
				  if(!err && docs) {
					console.log(docs);
					var r = docs.toObject();
					r.id = docs._id.toHexString(); // Not sure is this needed
					//r.time = r.time.toTimeString();
					res.json(201, r);
				  } else {
					res.json(500, {message: "error"});
				  }

				  });
				});
				} else {
					res.json(400, {message: "Invalid message type!"});
				}
			} else {
			  res.json(403, {message: "You don't have the rights to do that!"});
			}
		} else {
			res.json(500, {message: "error"});
		}
	});
  }
}
  
  
 // curl localhost:3000/api/users
/*
GET /api/users/
*/
function api_get_users(req, res) {
  User.find({}, '-password', function(err, users) {
    if (!err && users) {
	  res.send(200, users);
	} else {
	  res.send(500, {message : "Error"});
	} 
  });
}


/*
GET /api/users/:name
*/
function api_get_user(req, res) {
  var user = req.param('name');
  User.findOne({user : user}, '-password', function(err, users) {
    if (!err && users) {
	  console.log(users);
	  res.json(200, users);
	} else if (!users) {
		//res.status(404).send(JSON.stringify({message : 'User ' + user + ' not found'}))
		res.json(404, {message : 'User ' + user + ' not found'});
  } else {
    res.json(500, {message : "Error"});
  }
  });
}


/*
Gets user's all updates.
GET /updates/users/:name 
{
    message : String,
	type : String,  // "update" or "comment"
	parent: String, //Id to an update to which is replied. Used when message is a comment. "" when message is an user update
    time : { type: Date, default: Date.now },
    toWhom: String, // Id is receiver's name. 
    fromWhom: String // Id is sender's name. 
}
*/
function api_get_user_messages(req, res) {

  Message.find({type : 'update', fromWhom : req.param('name')}).sort({time:-1}).exec(function(err, messages) {
	if(!err) {
		var m = new Array();

		for (var i = 0; i < messages.length; i++) {
			var r = messages[i].toObject();
			r.id = messages[i]._id.toHexString();
			m.push(r);
		}
		res.json(200, m);
	} else {
		res.json(500, {message : "Error while getting user " + req.param('name') + " messages."});
	}
  });
}


/* Gets 5 newest user updates. */
function api_get_newest_messages(req, res) {

  Message.find({type : 'update'}).sort({time:-1}).limit(5).exec(function(err, messages) {
	if(!err) {
		var m = new Array();

		for (var i = 0; i < messages.length; i++) {
			var r = messages[i].toObject();
			r.id = messages[i]._id.toHexString();
			m.push(r);
		}
		res.json(200, m);
	} else {
		res.json(500, {message : "Error while getting newest updates" });
	}
  });
}


/* Gets 5 newest updates from authenticated user's friends. */
function api_get_newest_friend_messages(req, res) {
  var username = req.user;
  if (username !== req.param('name')) {
    res.json(403, {message : 'User ' + username + ' doesnt have rights.'});
  }
  
  User.findOne({user : username}, 'friends', function(err, user) {
	if (!err && user) {
		console.log(user.friends);
		  
		Message.find({type : 'update', fromWhom : {$in : user.friends}}).sort({time:-1}).limit(5).exec(function(err, messages) {
			if(!err) {
				var m = new Array();

				for (var i = 0; i < messages.length; i++) {
				var r = messages[i].toObject();
				r.id = messages[i]._id.toHexString();
				m.push(r);
				}
				res.json(200, m);
			} else {
				res.json(500, {message : "Error while getting friend updates for user " + req.param('name')});
			}
		});
		  
	} else
		res.json(404, {message : 'User ' + username + ' not found'});
  });
}


/*
Gets comments for given message id.
*/
function api_get_comments(req, res) {
  Message.find({type : 'comment', parent : req.param('msg_id')}).sort({time:-1}).exec(function(err, messages) {
	if(!err && messages) {
		var m = new Array();

		for (var i = 0; i < messages.length; i++) {
			var r = messages[i].toObject();
			r.id = messages[i]._id.toHexString();
			m.push(r);
		}
		res.json(200, m);
	} else if(err){
    res.json(500, {message : "Error"});
  }else{
		res.json(404, {message : "Couldn't get comments for message " + req.param('msg_id')});
	}
  });
}

var authentication_middleware;

// Vaaditaan autorisointi PUT:lle ja DELETE:lle.
// Autorisointi tarkistetaan authMiddleware:lla.
module.exports = function(authMiddleware) {
  authentication_middleware = authMiddleware;
  var app = express();
  
  // Kaikki API:n vastaukset ovat json-tyyppiä
  app.use(function(req, res, next) {
    res.type('application/json; charset=utf-8');
    next();
  });

  app.post('/messages/users/:name', authMiddleware, api_add_message);
  app.post('/users/', api_register_user);
  app.get('/updates/users/:name', api_get_user_messages);
  app.get('/updates/users/:name/friends', authMiddleware, api_get_newest_friend_messages);
  app.get('/updates/users/', api_get_newest_messages);
  app.get('/comments/:msg_id', api_get_comments);
  
  app.get('/users', api_get_users);
  app.get('/users/:name', api_get_user);
  app.put('/users/:name', authMiddleware, api_change_user);
  app.delete('/users/:name', authMiddleware, api_delete_user);

  return app;
};

