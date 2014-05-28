var assert = require("assert")

var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');

/*
describe('Connection', function(){
  var uri = 'mongodb://localhost/kamula';
  mongoose.connect(uri);
  var db = new Connection
    , tobi = new User('tobi')
    , loki = new User('loki')
    , jane = new User('jane');

  beforeEach(function(done){
    mongoose.connection.db.dropDatabase();
    db.clear(function(err){
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  })

  describe('#find()', function(){
    it('respond with matching records', function(done){
      db.find({ type: 'User' }, function(err, res){
        if (err) return done(err);
        res.should.have.length(3);
        done();
      })
    })
  })
})
*/


var should = require('should');
var assert = require('assert');
var request = require('supertest');
var mongoose = require('mongoose');
 
describe('Requesting api', function() {
	var url = 'localhost:3000';
	var uri = 'mongodb://localhost/kamula';
	var profile = {
		"user": "jeejee",
		"name": "Matti Nykänen",
		"email": "jeejee@jj",
		"password": "jeesukset"
	}
	// within before() you can run all the operations that are needed to setup your tests. In this case
	// I want to create a connection with the database, and when I'm done, I call done().
	before(function(done) {
		// In our tests we use the test db
		
		mongoose.connect(uri);	
		// Remove everything under 'users' collection
		mongoose.connection.collections['users'].drop( function(err) { });
		//mongoose.connection.db.dropDatabase();
		//User.remove({}, function(err) {
		//	console.log('User collection removed');
		//	
		//});
		done();
	});
	// use describe to give a title to your test suite, in this case the tile is "Account"
	// and then specify a function in which we are going to declare all the tests
	// we want to run. Each test starts with the function it() and as a first argument
	// we have to provide a meaningful title for it, whereas as the second argument we
	// specify a function that takes a single parameter, "done", that we will use
	// to specify when our test is completed, and that's what makes easy
	// to perform async test!
	describe('User', function() {
		it('should return 201 when registering an user', function(done) {
			// once we have specified the info we want to send to the server via POST verb,
			// we need to actually perform the action on the resource, in this case we want to
			// POST on /api/profiles and we want to send some info
			// We do this using the request object, requiring supertest!
			request(url)
			.post('/api/users/ ')
			.send(profile)
			.expect('Content-Type', /json/)
			.expect(201) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				// Check that everything is in place
				User.findOne({user : "jeejee"}, function(err, user) {
					if (!user || err) {
						false.should.be.true; // How else could you test it?
					} else {
						user.should.not.be.empty;
						user.should.not.be.NaN;
						user.password.should.equal("jeesukset");
						user.email.should.equal("jeejee@jj");
						user.name.should.equal("Matti Nykänen");
						
					}
					done();
				});
				
			});
		});
		
		it('should return 200 and right data when asking user data', function(done) {
			// once we have specified the info we want to send to the server via POST verb,
			// we need to actually perform the action on the resource, in this case we want to
			// POST on /api/profiles and we want to send some info
			// We do this using the request object, requiring supertest!
			request(url)
			.get('/api/users/jeejee')
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				// this is should.js syntax, very clear
				//res.should.have.status(200);
				res.body.user.should.equal(profile.user)
				res.body.name.should.equal(profile.name)
				res.body.email.should.equal(profile.email)
				res.body.should.have.property('_id')
				res.body.should.have.property('friends')
				res.body.active.should.equal(true)
				done();
				
				
			});
		});
		/*
		it('should correctly update an existing account', function(done){
			var body = {
				firstName: 'JP',
				lastName: 'Berd'
			};
			request(url)
				.put('/api/profiles/vgheri')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200) //Status code
				.end(function(err,res) {
					if (err) {
						throw err;
					}
					// Should.js fluent syntax applied
					res.body.should.have.property('_id');
					res.body.firstName.should.equal('JP');
					res.body.lastName.should.equal('Berd');
					res.body.creationDate.should.not.equal(null);
					done();
				});
		}); */
	});
	
	
	after(function(done) {
		// Remove everything under 'users' collection
		mongoose.connection.collections['users'].drop( function(err) { });
		done();
	});
});
