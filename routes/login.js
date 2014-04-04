
/*
 * GET home page.
 */

exports.index = function(req, res){
  var name = req.user;
  res.render('login', { title: 'Log in Kamula', username:name });
};