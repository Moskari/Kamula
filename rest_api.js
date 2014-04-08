
var express = require('express');

//var Hero = require('./models.js').Hero;

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');

var User = require('./models/user').User;
var Message = require('./models/message').Message;
var mongoose = require('mongoose');


var db = mongoose.connection;
db.once('open', function() {
  console.log("Connected to mongodb");
});

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

var funcs = require('./functions');

function api_change_user(req, res) {
  var username = req.param('name');
  
  User.findOne({user : username}, function(err, user) {
    if(!err && !user) {
		res.json(404,{message: 'User ' + username + 'does not exist.'});
	}
	
	authentication_middleware(req, res, function() {
		console.log(req.user + ' ' + username)
		if (req.user != username) {
			res.json(403, {message : 'You don\'t have the rights to change this profile.'});
		} else {
		  var length = 30;
		  if (!funcs.check_string_length(req.body.name, length)) {
			res.json(500, {message: 'Too long name.'});
		  }
		  user.name = req.body.name;
		  user.email = req.body.email;
		  user.friends = req.body.friends;
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

  
function api_add_message(req, res){
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
  
  
  
  //console.log(messages);
  //res.send(messages);
  //res.send(req.body);
  //res.send("message: " + req.body.message);
  //res.render('index', { title: 'Kamula' });
}
  
 // curl localhost:3000/api/users
function api_get_users(req, res) {
  User.find({}, '-password', function(err, users) {
    if (!err && users) {
	  res.send(201,JSON.stringify(users));
	}
	
  });
}

//TODO:
function api_get_user(req, res) {
  var user = req.param('name');
  User.findOne({user : user}, '-password', function(err, users) {
    if (!err && users) {
	  res.json(users);
	} else
		res.status(404).send(JSON.stringify({message : 'User ' + user + ' not found'}))
  });
}


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


// curl -H 'Content-Type: application/json' -X POST -d '{"heroid": "spiderman", "name": "Spider Man", "city": "New York"}' localhost:3000/api/heroes
function heroesPost(req, res) {
  var hero = new Hero(req.body);
  hero.save(function(err, savedHero) {
    if (!err) {
      res.setHeader('Location', '/api/heroes/'+savedHero.heroid);
      res.status(201).send(JSON.stringify(savedHero));
    }
    else {
      res.status(403).send(JSON.stringify({err:err}));
    }
  });
}

 // curl localhost:3000/api/heroes/spiderman
function heroGet(req, res) {
  var heroid = req.param('heroid');
  Hero.findOne({heroid:heroid}, function(err, hero) {
    if (hero) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(404).send(JSON.stringify({err:"Not found"}));
    }
  });
}

// curl -u 'antti:1234' -X DELETE localhost:3000/api/heroes/spiderman
function heroDelete(req, res) {
  // Nykyisessä toteutuksessa kuka vain voi tehdä mitä vain, kunhan on autentikoitunut.
  // Monasti olisi kiva vielä rajoittaa tätä niin, että vain itsensä saa poistaa/muokata.
  // esim. if(heroid!==req.user) { res.status(403).send(...
  // Samoin PUT:ssa...

  var heroid = req.param('heroid');
  Hero.findOneAndRemove({heroid:heroid}, function(err, hero) {
    if (hero) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(404).send();
    }
  });
}

// curl -u 'antti:1234' -H 'Content-Type: application/json' -X PUT -d '{"heroid": "hulk", "name": "Hulk", "city": "Ohio"}' localhost:3000/api/heroes/hulk
function heroPut(req, res) {
  var heroid = req.param('heroid');
  if (heroid!==req.body.heroid) {
      res.status(409).send(JSON.stringify({err:heroid+" != "+req.body.heroid}));
  }
  Hero.findOneAndUpdate({heroid:heroid}, req.body, {upsert:true}, function(err, hero) {
    if (!err) {
      res.send(JSON.stringify(hero));
    }
    else {
      res.status(500).send(JSON.stringify({err:err}));
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
  
  
  app.post('/heroes', heroesPost);
  app.get('/heroes/:heroid', heroGet);
  app.put('/heroes/:heroid', authMiddleware, heroPut);
  app.delete('/heroes/:heroid', authMiddleware, heroDelete);

  return app;
};

