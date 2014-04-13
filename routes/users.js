/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');

/* Renders users page. */
exports.list = function(req, res){
  //res.send("respond with a resource");
  var users = new Array();
  var user_friends = new Array;
  var name = req.user;

  // Find all users and list them
  User.find({},'user', function(err, docs) { // select user fields
  if(!err && docs) {
	for (var i = 0; i < docs.length; i++) {
	  users.push(docs[i].user);
	  console.log(docs[i].user);
	}
	if (name) { // Find all friends of the logged in user and send them to template to find out if "add friend" button is added.
      User.findOne({user : name}, 'friends', function(e, doc) {
        if(!e && doc) {
		  for (var i = 0; i < doc.friends.length; i++) {
            user_friends.push(doc.friends[i] + '');
	      }
	      //user_friends = doc.friends;
		  console.log(user_friends);
		  res.render('users', {'title':'Users', 'users':users, username:name, user_friends : user_friends}); 

	    }
      });
    }
	// For some reason this has to be here like this so that users array has anything in it.
	res.render('users', {'title':'Users', 'users':users, username:name, user_friends : user_friends}); 
  } else if (!err){
    res.render('users', {'title':'Users', 'users':users, username:name, user_friends : user_friends, message : ''});
  } else {
    res.render('users', {'title':'Users', 'users':users, username:name, user_friends : user_friends, message : 'Error with querying users.'});
  }
  
  });
  console.log(users);
};

/* Shows user profile. Depending on if the user is logged in or not, message form is shown to the user. */
exports.show_user = function(req, res){
  
  var logged_user = req.user;
  var name = req.param('name');
  var update_access = false;
  if (logged_user === name)
    update_access = true;
  
  res.render('user', {title:name, username : logged_user, post_url:'/api/messages/users/', update_access:update_access});
};

/* POST method that adds user a friend and then adds user as a friend's friend. */
exports.add_friend = function(req,res) {
  var user = req.user;
  var friend = req.param('name');
  if (user && user != friend) {
	  User.findOne({user : user}, 'friends', function(e, doc) {
        if(!e && doc) {
		  if (doc.friends.indexOf(friend) >= 0) { // Don't add same friend multiple times
		    console.log('Friend ' + friend + ' is already a friend of ' + user);
		    res.redirect('/users');
		  } else {
		    console.log(friend);
	        doc.friends.push(friend);
		    console.log(doc.friends);
		    doc.save(function(err) {
			  // Add user to friend's friend
		      if (!err) {
			    User.findOne({user : friend}, 'friends', function(e2, doc2) {
                  if(!e2 && doc2) {
			        if (!(doc.friends.indexOf(user) >= 0)) {
			          doc2.friends.push(user);
		              console.log(doc2.friends);
		              doc2.save(function(err) {
					    if(!err) {
						  console.log('Friend ' + friend + ' added to ' + user);
						  res.redirect('/users');
						} else {
						  console.log('Problem with saving ' + user + ' to ' + friend);
						  res.redirect('/users');
						}
					  });
					}				
                  } else if(e2) {
				    console.log('Couldnt find friends of added friend.');
				  }
                }); 
			  
			  } else {
			    console.log('Problem with saving ' + friend + ' to ' + user);
			    res.redirect('/users');
			  }
		    });
		  
		  }
	    } else if(e) {
		  console.log('Couldnt find logged user s friends.');
		  res.redirect('/users');
		} else {
		  console.log('User doesnt have friends.');
		  res.redirect('/users');
		}
		
      });

  } else
    res.redirect('/users');
}

var funcs = require('../functions');

/* Registers a new user. Takes information from a form.*/
exports.register_user = function(req, res) {
  var msg = '';
  var user = new User();
  var name = req.user;
  User.findOne({user : req.body.user}, function(err, docs) {
    if(!err && !docs) {
	  console.log(docs);
	  
	  if (!funcs.check_string_chars(req.body.username) || !funcs.check_string_length(req.body.username, 99999)) {
	    msg = 'Bad username! ';
	  }
	  user.user = req.body.username;
	  
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
	    res.render('register', { title: 'Register to Kamula',  message : msg, username:name });
	  } else {
      user.save(function (err, m) {
        if (!err) {
		  console.error(err);
		  msg = 'Success';
		  res.render('register', { title: 'Register to Kamula',  message : msg, username:name });
		} else {
		  msg = 'Problem with registering new user';
		  res.render('register', { title: 'Register to Kamula',  message : msg, username:name });
		}
      });
	  }
	} else if(!err) {
	  msg = 'Username exists';
	  console.error(msg);
	  
	  res.render('register', { title: 'Register to Kamula',  message : msg, username:name });
	} else {
	  msg = 'Error';
	  res.render('register', { title: 'Register to Kamula',  message : msg, username:name });
	}
  });


  
  //res.render('register', { title: 'Register to Kamula', post_url: '/api/users/', message : msg });
}


  
  
  