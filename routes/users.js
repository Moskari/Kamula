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
  res.send('Success');
}