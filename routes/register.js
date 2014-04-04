
/*
 * GET home page.
 */

exports.index = function(req, res){
  var name = req.user;
  res.render('register', { title: 'Register to Kamula', message : '', username:name });
};