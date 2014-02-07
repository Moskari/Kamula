
/*
 * GET users listing.
 */

exports.list = function(req, res){
  //res.send("respond with a resource");
  res.render('users', {'title':'Users', 'users':['monni','isomonni']});
};