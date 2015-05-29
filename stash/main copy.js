var express = require('express');
var path = require('path');


// -----------------------------------
// Basic Route
// -----------------------------------

var basicRoutes = express.Router();

// will match /admin
basicRoutes.get('/', function(req,res) {
	res.sendFile(path.join(__dirname + '/../../public/index.html'));
});


// ----------------------------------
// Else Route
// ----------------------------------

var otherRoutes = express.Router();

// will match all
otherRoutes.get('*', function(req,res) {
	res.send('Ooops. Nothing to see here!');
});


// -----------------------------------
// Admin Route
// -----------------------------------

// get an instance of the router
var adminRoutes = express.Router();

// route middleware that will happen on every request
adminRoutes.use(function(req, res, next) {
	
	// log each request to the console
	console.log(req.method, req.url);
	
	// continue doing what we were doing and go to the route
	next();
});

// will match /admin
adminRoutes.get('/', function(req,res) {
	res.send('I am the dashboard!');
});

// will match /admin/users
adminRoutes.get('/users', function(req,res) {
	res.send('I show all the users!');
});


// route middleware to validate :name
// This is placed before the request

adminRoutes.param('name', function(req,res,next,name) {
	
	// do validation on name here
	// blah blah validation
	
	// log smething so we know its working
	console.log('doing name validations on ' + name);
	
	// once the validation is done save the new item in the req
	req.name = name;
	
	// go to the next thing
	next();
});

// route with parameters
adminRoutes.get('/users/:name', function(req,res) {
	res.send('Hello ' + req.params.name + '!');
});

// will match /admin/posts
adminRoutes.get('/posts', function(req,res) {
	res.send('I show all the posts!');
});


module.exports = {
	basicRoutes: basicRoutes,
	adminRoutes: adminRoutes,
	otherRoutes: otherRoutes
}