
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var users = require('./routes/users');
var login = require('./routes/login');
var register = require('./routes/register');
var settings = require('./routes/settings');
var http = require('http');
var path = require('path');


var mongoose = require('mongoose');

var uri = 'mongodb://localhost/kamula';
//global.db = mongoose.createConnection(uri);
mongoose.connect(uri);
// Login-/autentikointikamaa

//var passport = require('passport');
var authentication = require('./authentication');
var passport = authentication.passport;
//var LocalStrategy = require('passport-local').Strategy;
//var BasicStrategy = require('passport-http').BasicStrategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

// Database

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

var restApi = require('./rest_api.js');
app.use('/api/', restApi(authentication.check_api_authentication))

//ensureLoggedIn('/login')
app.get('/', routes.list);
app.post('/login', passport.authenticate('local',
         {successRedirect: '/', failureRedirect: '/login'}));
app.get('/login', login.index);
app.post('/register', users.register_user);
app.get('/register', register.index);
app.get('/logout', authentication.logout);
app.get('/users', users.list);
app.get('/users/:name', users.show_user);
app.post('/add_friend/:name', ensureLoggedIn('/login'), users.add_friend);
app.get('/settings', ensureLoggedIn('/login'), settings.show_settings);

// Handlers for api
//app.post('/api/messages/users/:name', passport.authenticate('basic', {session: false}), messages.api_add_message);
//app.post('/api/users/', passport.authenticate('basic', {session: false}), users.api_register_user);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
