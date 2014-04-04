var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');
/*
 * GET home page.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
  var users = new Array();
  var name = req.user;
  if (name) {
	User.findOne({user : name},'friends', function(err, doc) { // select user fields
	console.log(err);
	console.log(doc);
    if(!err && doc) {
	  for (var i = 0; i < doc.friends.length; i++) {
	    users.push(doc.friends[i]);
	    console.log(doc.friends[i]);
	  }
    }
	// For some reason this has to be here like this so that users array has anything in it.  
    res.render('index', {'title':'Kamula', 'users':users, username:name});
    });
	
	
  } else {
  // Find all users and list them
  User.find({},'user', function(err, docs) { // select user fields
  if(!err && docs) {
	for (var i = 0; i < docs.length; i++) {
	  users.push(docs[i].user);
	  console.log(docs[i].user);
	}
  }
	// For some reason this has to be here like this so that users array has anything in it.  
    res.render('index', {'title':'Kamula', 'users':users, username:name});
  });
  console.log(users);
  
  //res.render('users', {'title':'Users', 'users':['monni','isomonni']});
  }
};
 
 
exports.index = function(req, res){
  var name = req.user;;
  
  //if ("username" in req.user) { name = req.user.username;}
  res.render('index', { title: 'Kamula', username:name });
};