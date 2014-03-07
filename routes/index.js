
/*
 * GET home page.
 */

exports.index = function(req, res){
  var name = req.user;;
  
  //if ("username" in req.user) { name = req.user.username;}
  res.render('index', { title: 'Kamula', username:name });
};