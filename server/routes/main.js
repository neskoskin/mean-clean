var express = require('express');
var path = require('path');


// API Routes ======================
// =================================

var apiRoutes = express.Router();

// will match /admin
apiRoutes.get('/', function(req,res) {
	//res.sendFile(path.join(__dirname + '/../../public/index.html'));
	res.send('API root here!');
});


// Else Route ======================
// =================================

var otherRoutes = express.Router();

// will match all
otherRoutes.get('*', function(req,res) {
	res.send('Ooops. Nothing to see here!');
	//console.log(req.method + " " + req.path);
});


// Export the routes ---------------

module.exports = {
	apiRoutes: apiRoutes,
	otherRoutes: otherRoutes
}
