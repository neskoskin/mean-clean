var config = require('../../config');

var jwt = require('jsonwebtoken');
var superSecret = config.secret;

module.exports = {
	
	// Route for authenticating a user
	authentication: function(req, res) { 
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
	},
	
	// Middleware for verifying a token
	verification: function(req, res, next) {
			
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
	}		
}