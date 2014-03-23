var User = require('../models/user').User;
var mongoose = require('mongoose');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
  res.render('users', {'title':'Users', 'users':['monni','isomonni']});
};

exports.show_user = function(req, res){
  //res.send("respond with a resource");
  // Temporarily always enabled
  //var logged_user = req.user;
  var logged_user = 'asdsadaasdad';
  var name = req.param('name');
  res.render('user', {'title':name, 'post_url':'/api/messages/users/', logged_user:logged_user});
};

exports.api_register_user = function(req, res) {
  
  // Does nothing
  var user = new User();
  
  User.findOne({user : req.body.user}, function(err, docs) {
    if(!err && !docs) {
	  console.log(docs);
	  
	  user.user = req.body.user;
	  user.name = req.body.name;
	  user.email = req.body.email;
      user.password = req.body.password;
  
      user.save(function (err, m) {
        if (!err) {
		  console.error(err);
		  res.json(201,{message: 'New user ' + user.user + ' registered'});
		} else {
		  res.json(500,{message: 'Problem with registering new user'});
		}
      });
	  
	  
	  
	} else if(!err) {
	  res.json(403, {Location : '/api/users/'+req.body.user, message : 'Username exists!'});
	} else {
	  res.json(500, {message: "error"});
	}
  });
  
  
  
  //res.send('Success');
}