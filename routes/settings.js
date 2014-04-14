/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');

/* Just renders the settings page for logged in user. */
exports.show_settings = function(req, res){
  var name = req.user;
  res.render('settings', { title: 'Kamula', username:name, message : "" });
};