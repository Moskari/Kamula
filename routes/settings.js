var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');


exports.show_settings = function(req, res){
  var name = req.user;
  res.render('settings', { title: 'Kamula', username:name, message : "" });
};