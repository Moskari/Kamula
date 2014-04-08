/* Useful functions */

var User = require('./models/user').User;
var Message = require('./models/message').Message;
var mongoose = require('mongoose');

exports.check_string_length = function(string, length) {
	return string.length <= length;
}

exports.check_string_chars = function(string) {
	var regex = new RegExp("^[a-zA-Z0-9]*$"); 
	return regex.test(string);
}