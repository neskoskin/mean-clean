// The login route. 
// Use app.route as a shortcut to the Router to define multiple requests on the route
module.exports = function(app) {
	
	// use app.route to define multiple actions on a single route
	app.route('/login')
	
		.get(function(req,res) {
			res.send('This is the login form');
		})
	
		.post(function(req, res) {
			console.log('processing');
			res.send('Processing the login form!');
	});

}