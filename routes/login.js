/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */
 
/* Index page of login screen. */
exports.index = function(req, res){
  var name = req.user;
  res.render('login', { title: 'Log in Kamula', username:name });
};