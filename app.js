
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var messages = require('./routes/messages');
var login = require('./routes/login');
var http = require('http');
var path = require('path');

// Login-/autentikointikamaa
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Database
var mongoose = require('mongoose');

var uri = 'mongodb://localhost/messages';
//global.db = mongoose.createConnection(uri);
mongoose.connect(uri);
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.bodyParser());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//app.use(express.cookieParser('your secret here'));
app.use(express.cookieParser());
//app.use(express.session());
app.use(express.session({secret: 'huippusalaista666'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Autentikointi copypastaa

// Lomakekirjautuminen
passport.use(new LocalStrategy(
  {
    // Kenttien nimet HTML-lomakkeessa
    usernameField: 'kayttaja',
    passwordField: 'salasana'
  },
  function(username, password, done) {
    if (salasanaOikein(username, password)) {
      return done(null, username);
    }
    return done(null, false);
  }
));

// HTTP Basic Auth
passport.use(new BasicStrategy(
  function(username, password, done) {
    if (salasanaOikein(username, password)) {
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

function salasanaOikein(username, password) {
  return username==='antti' && password==='1234';
}


function logout(req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

// Copypaste loppuu


//ensureLoggedIn('/login')
app.get('/', routes.index);
app.post('/login', passport.authenticate('local',
         {successRedirect: '/', failureRedirect: '/login'}));
app.get('/login', login.index);
app.post('/logout', logout);
app.get('/users', users.list);
app.get('/users/:name', users.show_user);
app.post('/api/messages/users/:name', messages.add_message);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
