/* 
 * TIE-23500 Web-ohjelmointi, Kamula-harjoitustyo
 * Authors: Samuli Rahkonen, Pekka Pennanen
 * Date: 12.4.2014
 */

/* Here are the REST api tests for Kamula */

var assert = require("assert")

var User = require('../models/user').User;
var Message = require('../models/message').Message;
var mongoose = require('mongoose');


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
	var profile2 = {
		"user": "kayttaja",
		"name": "Tero Testaaja",
		"email": "a@a.a",
		"password": "salasana"
	}
	
	
	before(function(done) {
		mongoose.connect(uri);	
		// Remove everything under 'users' collection
		mongoose.connection.collections['users'].drop( function(err) { });
		
		user = new User();
		user.user = "kayttaja";
		user.password = "salasana";
		user.email = "a@a.a";
		user.name = "Tero Testaaja";
		user.friends = new Array();
		user.active = true;
		
		user.save(function (err, m) { 
			if (err) throw err; 
			console.log(m);
			done();
		});
		
	});

	describe('User', function() {
		it('should return 201 when registering an user', function(done) {
			request(url)
			.post('/api/users/')
			.send(profile)
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
		
		
		it('should return 400 when registering an user with invalid data', function(done) {
			var p = { "user":"asd", "password" : "", "name": "Tero Testaaja", "email": "a@a.a"}
			request(url)
			.post('/api/users/')
			.send(p)
			.expect(400) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				done();
			});
		});
		
		
		it('should return 403 when registering an existing user name', function(done) {
			request(url)
			.post('/api/users/')
			.send(profile2)
			.expect(403) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				done();
			});
		});
		
		
		it('should return 200 and right data when asking user data', function(done) {
			request(url)
			.get('/api/users/kayttaja')
			.expect(200) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				// this is should.js syntax, very clear
				//res.should.have.status(200);
				res.body.user.should.equal(profile2.user)
				res.body.name.should.equal(profile2.name)
				res.body.email.should.equal(profile2.email)
				res.body.should.have.property('_id')
				res.body.should.have.property('friends')
				res.body.active.should.equal(true)
				done();
			});
		});
		
		
		it('should return 404 when asking non-existent user data', function(done) {
			request(url)
			.get('/api/users/unknown')
			.expect(404) //Status code
			// end handles the response
			.end(function(err, res) {
				if (err) {
					throw err;
				}
				done();
			});
		});
		
		
	});
	
	
	after(function(done) {
		// Remove everything under 'users' collection
		mongoose.connection.collections['users'].drop( function(err) { });
		done();
	});
});
