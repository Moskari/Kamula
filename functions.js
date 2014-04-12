/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

/* Useful functions */

var User = require('./models/user').User;
var Message = require('./models/message').Message;
var mongoose = require('mongoose');

exports.check_string_length = function(string, length) {
	return (string.length <= length && string.length > 0);
}

exports.check_string_chars = function(string) {
	var regex = new RegExp("^[a-zA-Z0-9]*$"); 
	return regex.test(string);
}