
/**
 * Module dependencies.
 */

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
  return username==='antti' && password==='1234';
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
