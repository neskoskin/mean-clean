var express = require('express');
var path = require('path');

// jwt package
var jwt = require('jsonwebtoken');
var superSecret = 'ilovenintendonintendonintendo';

var User = require('../models/user');


// =================================
// Routes for our API
// =================================

// get an instance of the express router
var apiRouter = express.Router();


// ---------------------------------
// Route for authenticating users
// ---------------------------------

apiRouter.post('/authenticate', function(req, res) { 
	
	// find the user
	// select the name, username, and password explicitly
	User.findOne({username: req.body.username})
		.select('name username password')
		.exec(function(err, user) {
		
			if (err) throw err;
		
			// no user with that username was found
			if (!user) {
				res.json({ 
					success: false, 
					message: 'Authentication failed. User not found.' 
				});
			} else if (user) {
				
				// user found
				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false, 
						message: 'Authentication failed. Wrong password.'
					});
				} else {
					// user is found and password matches
					// create a token
					var token = jwt.sign(
						{ name: user.name, username: user.username }, 
						superSecret, 
						{ expiresInMinutes: 1440 /* expires in 24 hrs */ });
					
					// return the information including token as json	
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});	
				}
			}
		});
});


// ---------------------------------
// Middleware to verify token
// ---------------------------------
apiRouter.use(function(req, res, next) {

	console.log('[~console] Somebody just came to out API!');
		
	// check header, url parameters, or post parameters for token

	// req.param('token') is deprecated!
	// req.params.foo -> /x/123 for x/:foo
	// req.query.foo -> /x/?foo=123
	
	// the problem lies in securing url parameters...see notes!
	// maybe best to not use "req.query.token"...see notes!

	var token = req.query.token || req.body.token || req.headers['x-access-token'];
	
	// decode token
	if (token) {
	
		// verifies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded) {
			if (err) {
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				// go to next route only if everything checks ok
				next();
			}
		});
		
	} else {
		
		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
	// make sure we go to the next routers and don't stop here
	// next();
});


// ---------------------------------
// First Route
// ---------------------------------
// test route to make sure everything is working
// will match /api
apiRouter.get('/', function(req,res) {
	res.json({ message: 'hooray! welcome to our API!' });
});


// ---------------------------------
// On Routes that end in /users
// ---------------------------------
apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req,res) {
		
		// create a new instance of the user model
		var user = new User();
		
		// set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;
		
		// save the user and check for errors
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000) {
					return res.json({ 
							success: false, 
							message: 'A user with that username already exists. ' });
				} else {
					return res.send(err);
				}
			}
			res.json({ message: 'User created!' });
		});
	})
	
	// get all teh users (accessed at GET http://localhost:8081/api/users)
	.get(function(req,res) {
		
		User.find(function(err, users) {
			if (err) res.send(err);
			// return the users in json format
			res.json(users);
		})
		
	});


// ---------------------------------
// On Routes that end in /:user_id
// ---------------------------------
apiRouter.route('/users/:user_id')

	// get the user with user_id
	// accessed at GET http://localhost:8081/api/users/:user_id
	
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			// return  that user
			res.json(user);
		});
	})
	
	// update the user with this id
	// accessed at PUT http://localhost:8081/api/users/:user_id
	.put(function(req, res) {
		
		// find user by id
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			
			// update the user info only if its new (passed through from the PUT request)
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;
			
			// save the user
			user.save(function(err) {
				if (err) res.send(err);
				// return a message
				res.json({message: 'User updated!'});
			});
		});
	})
	
	// delete the user with this id
	// (accessed at DELETE http://localhost:8081/api/users/:user_id)
	.delete(function(req,res) {
		User.remove({_id: req.params.user_id}, function(err, user) {
			if (err) return res.send(err);
			res.json({message: 'Successfully deleted user!'});
		});
	});


// ---------------------------------
// Route to get logged-in user info
// ---------------------------------
apiRouter.get('/me', function(req,res) {
	// req.decoded is the user info added earlier in the verification middleware
	res.send(req.decoded);
});


// --------------------------------
// Route for all other API requests
// --------------------------------
apiRouter.get('*', function(req,res) {
	// req.decoded is the user info added earlier in the verification middleware
	res.json({message: 'Nothing to return. Check API path.'});
});


// ---------------------------------
// EXPORT the route
// ---------------------------------
module.exports = {
	apiRouter: apiRouter
}


//res.sendFile(path.join(__dirname + '/../../public/index.html'));