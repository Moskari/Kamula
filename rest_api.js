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
POST /api/users/ {user : "D4RT_V4D3R", name : "Petteri", email : "aaasd@asddd.asd", password : "111"} 
*/
function api_register_user(req, res) {
  
  var user = new User();
  
  User.findOne({user : req.body.user}, function(err, docs) {
    if(!err && !docs) {
	  console.log(docs);
	  
	  user.user = req.body.user;
	  user.name = req.body.name;
	  user.email = req.body.email;
      user.password = req.body.password;
      user.friends = new Array();
	  user.active = true;
	  
      user.save(function (err, m) {
        if (!err) {
		  console.error(err);
		  res.json(201,{message: 'New user ' + user.user + ' registered'});
		} else {
		  res.json(500,{message: 'Problem with registering new user'});
		}
      });
	  
	} else if(!err) {
	  res.setHeader('Location', '/api/users/'+req.body.user);
	  //res.json(403, {Location : '/api/users/'+req.body.user, message : 'Username exists!'});
	  res.json(403, {message : 'Username exists!'});
	} else {
	  res.json(500, {message: "error"});
	}
  });
}



/* 
PUT /api/users/:name {name : "Petteri", email : "asd@asd.asd", password : "aaa"} 
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
			res.json(500, {message: 'Too long name.'});
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
  message.message = data.message;
  message.type = data.type;
  message.parent = data.parent;
  //message.time = Date,
  if (data.type == "update")
    message.toWhom = req.user;
  else if (data.type == "comment")
    message.toWhom = data.toWhom;
  message.fromWhom = req.user;
  
  message.save(function (err, m) {
    if (err) return console.error(err);
	
	Message.findOne({_id : message._id}, function(err, docs) {
		if(!err && docs) {
		  console.log(docs);
		  var r = docs.toObject();
		  r.id = docs._id.toHexString(); // Not sure is this needed
		  //r.time = r.time.toTimeString();
		  res.json(200, r);
		} else {
		  res.json(500, {message: "error"});
		}

	  });
	
  });
  
}
  
 // curl localhost:3000/api/users
/*
GET /api/users/
*/
function api_get_users(req, res) {
  User.find({}, '-password', function(err, users) {
    if (!err && users) {
	  res.send(201,JSON.stringify(users));
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
	  res.json(users);
	} else
		res.status(404).send(JSON.stringify({message : 'User ' + user + ' not found'}))
  });
}
/*
POST /messages/users/:name 
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
	if(!err && messages) {
		var m = new Array();

		for (var i = 0; i < messages.length; i++) {
			var r = messages[i].toObject();
			r.id = messages[i]._id.toHexString();
			m.push(r);
		}
		res.json(200, m);
	} else {
		res.json(404, {message : "Couldn't get updates for user " + req.param('name')});
	}
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
	} else {
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
  app.post('/users/', authMiddleware, api_register_user);
  app.get('/updates/users/:name', api_get_user_messages);
  app.get('/comments/:msg_id', api_get_comments);
  
  app.get('/users', api_get_users);
  app.get('/users/:name', api_get_user);
  app.put('/users/:name', authMiddleware, api_change_user);
  app.delete('/users/:name', authMiddleware, api_delete_user);
  /*
  app.post('/heroes', heroesPost);
  app.get('/heroes/:heroid', heroGet);
  app.put('/heroes/:heroid', authMiddleware, heroPut);
  app.delete('/heroes/:heroid', authMiddleware, heroDelete);
  */
  return app;
};

