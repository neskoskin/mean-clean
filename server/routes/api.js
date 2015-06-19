var path = require('path');
var User = require('../models/user');
var helperMiddleware = require('./helpers/middleware');
var authentication = helperMiddleware.authentication;
var verification = helperMiddleware.verification;

module.exports = function(app, express) {
	
	// =================================
	// Routes for our API
	// =================================
	
	// get an instance of the express router
	var apiRouter = express.Router();
	
	// ---------------------------------
	// Middleware for logging
	// ---------------------------------
	apiRouter.use(function(req, res, next) {
		console.log('[~console] Somebody just came to out API!');
		next();
	});
	
	// ---------------------------------
	// Route for authenticating users
	// ---------------------------------
	apiRouter.post('/authenticate', authentication);
	
	// ---------------------------------
	// Middleware to verify token
	// ---------------------------------
	apiRouter.use(verification);
	
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
				res.json({ success:true, message: 'User created!' });
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
					res.json({success:true, message: 'User updated!'});
				});
			});
		})
		
		// delete the user with this id
		// (accessed at DELETE http://localhost:8081/api/users/:user_id)
		.delete(function(req,res) {
			User.remove({_id: req.params.user_id}, function(err, user) {
				if (err) return res.send(err);
				res.json({success:true, message: 'Successfully deleted user!'});
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
	// Leave this last so that non-authenticated users cannot trace the 
	// available API routes (they will simply be asked to provide a token
	// regardless of non-available API path)
	apiRouter.get('*', function(req,res) {
		// req.decoded is the user info added earlier in the verification middleware
		res.json({success:false, message: 'Nothing to return. Check API path.'});
	});
	
	// ---------------------------------
	// EXPORT the route
	// ---------------------------------
	
	return apiRouter;
	
};


/*
// ---------------------------------
// EXPORT the route
// ---------------------------------
module.exports = {
	apiRouter: apiRouter
}
*/

//res.sendFile(path.join(__dirname + '/../../public/index.html'));