
/*
 * GET home page.
 */

exports.add_message = function(req, res){
  console.log(req.body.message);
  console.log(JSON.stringify(req.body));
  
  res.send(req.body)
  //res.send("message: " + req.body.message);
  //res.render('index', { title: 'Kamula' });
};