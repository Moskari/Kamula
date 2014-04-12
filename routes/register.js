/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

exports.index = function(req, res){
  var name = req.user;
  res.render('register', { title: 'Register to Kamula', message : '', username:name });
};