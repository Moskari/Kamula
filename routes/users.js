var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
  var users = new Array();
  // Find all users and list them
  User.find({},'user', function(err, docs) { // select user fields
  if(!err && docs) {
	for (var i = 0; i < docs.length; i++) {
	  users.push(docs[i].user);
	  console.log(docs[i].user);
	}
	// For some reason this has to be here like this so that users array has anything in it.
	res.render('users', {'title':'Users', 'users':users}); 
  } else {
    res.render('users', {'title':'Users', 'users':users});
  }
  
  });
  console.log(users);
  
  //res.render('users', {'title':'Users', 'users':['monni','isomonni']});
};

exports.show_user = function(req, res){
  //res.send("respond with a resource");
  var update_access = false;
  var logged_user = req.user;
  var name = req.param('name');
  if (logged_user === name)
    update_access = true;
  

  Message.find({fromWhom : name}).sort({time:-1}).select('message type fromWhom').exec(function(err, docs) {
		if(!err && docs) {
		  console.log("Getting user messages:");
		  console.log(docs);
		  //for (var i = 0; i < docs.length; i++) {
			  //if (docs[i].type == 'update')
			    //console.log(docs[i].user);
		  //}
		  res.render('user', {title:name, post_url:'/api/messages/users/', update_access:update_access, messages:docs});
		} else {
		  res.render('user', {title:name, post_url:'/api/messages/users/', update_access:update_access, messages:new Array()});
		}

	  });

};


exports.register_user = function(req, res) {
  var msg = '';
  var user = new User();
  
  User.findOne({user : req.body.user}, function(err, docs) {
    if(!err && !docs) {
	  console.log(docs);
	  
	  user.user = req.body.username;
	  user.name = req.body.name;
	  user.email = req.body.email;
      user.password = req.body.password;
  
      user.save(function (err, m) {
        if (!err) {
		  console.error(err);
		  msg = 'Success';
		  res.render('register', { title: 'Register to Kamula',  message : msg });
		} else {
		  msg = 'Problem with registering new user';
		  res.render('register', { title: 'Register to Kamula',  message : msg });
		}
      });
	  
	} else if(!err) {
	  msg = 'Username exists';
	  console.error(msg);
	  
	  res.render('register', { title: 'Register to Kamula',  message : msg });
	} else {
	  msg = 'Error';
	  res.render('register', { title: 'Register to Kamula',  message : msg });
	}
  });


  
  //res.render('register', { title: 'Register to Kamula', post_url: '/api/users/', message : msg });
}


  
  
  