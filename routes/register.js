
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('register', { title: 'Register to Kamula', message : '' });
};