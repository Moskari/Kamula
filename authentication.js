
/**
 * Module dependencies.
 */

var User = require('./models/user').User;
var mongoose = require('mongoose');
 
// Login-/autentikointikamaa
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

exports.passport = passport;

// development only
//if ('development' == app.get('env')) {
//  app.use(express.errorHandler());
//}

//Autentikointi copypastaa

var basicAuth = passport.authenticate('basic', {session: false});

// Tarkistetaan autentikointi.
// 1. Ensin katsotaan onko käyttäjä kirjautunut istuntoon (passport.session)
// 2. Ellei, tarkistetaan oliko pyynnössä kelvolliset Basic Auth -tunnukset
//
// 1. vaihtoehto on tarkoitettu selaimelta tehtäville Ajax-pyynnöille, jotka
// hyväksytään vain jos käyttäjä on kirjautunut sisään, eli req.user on jotain.
// Tällöin pyyntöön ei tarvitse liittää Basic Auth -headereita mukaan.
// Tämä tapa ei ole 100% restful, mutta jos istuntokirjautumista joka tapauksessa
// käytetään, niin eiköhän tämä ole ok...
//
// Basic Auth sitten muita käyttötapauksia varten.
exports.check_api_authentication = function(req, res, next) {
  if (req.user) { // 1.
    next();
  }
  else { // 2.
    basicAuth(req, res, next);
  }
}



// Lomakekirjautuminen
passport.use(new LocalStrategy(
  {
    // Kenttien nimet HTML-lomakkeessa
    usernameField: 'kayttaja',
    passwordField: 'salasana'
  },
  function(username, password, done) {
    if (password_correct(username, password)) {
      return done(null, username);
    }
    return done(null, false);
  }
));

// HTTP Basic Auth
passport.use(new BasicStrategy(
  function(username, password, done) {
    if (password_correct(username, password)) {
      return done(null, username);
    }
    return done(null, false);
  }
));

// Serialisointi session-muuttujaksi
passport.serializeUser(function(user, done) {
  done(null, user);
});

// Deserialisointi session-muuttujasta
passport.deserializeUser(function(user, done) {
  done(null, user);
});



function password_correct(username, password) {
  //var correct = false;
  //User.findOne(username,'user password', function(err, docs) { // select user and password fields
  
  //  if(!err && docs) {
  //    console.log(docs);
  //    correct = docs.password === password;
      return username==='antti' && password==='1234';
  //  }
  //});
  //console.log(correct);
  //return correct;
}

exports.password_correct = function(username, password) {
  return password_correct(username, password);
};


function logout(req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}
exports.logout = function(req, res) {
  logout(req, res);
}; 
