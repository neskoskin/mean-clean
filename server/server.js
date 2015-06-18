// =========================================
// BASE SETUP
// =========================================


// Call the packages
// -----------------------------------------

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var apiRoutes = require('./routes/api');
var otherRoutes = require('./routes/other');

var app = express();
var port = process.env.PORT || 1337;


// APP Configuration
// -----------------------------------------

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Request-With, content-type, Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));


// connect to out database
mongoose.connect('mongodb://localhost/test');



// =========================================
// ROUTING
// =========================================


// Static directory
// -----------------------------------------

app.use(express.static(__dirname + '/../public'));



// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++


// Test 1 2 3

var router = express.Router();

router.post('*', function(request, response){
    console.log('got the post!');
    var filepath = "./temp/.xml" + request.param('setid');
    response.send(filepath);
});

app.use('/getXml', router);


// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++




// Basic route, home page
// -----------------------------------------

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../public/app/views/index.html'));
});


// API Routes
// -----------------------------------------

// REGISTER the api router to the application
// all of the API routes will be prefixed with /api
app.use('/api', apiRoutes.apiRouter);

// another way is to export a function and send the 'app' variable
// to do the registration from inside the route's file (see Login Routes - next)


// Login Routes
// -----------------------------------------

// Another way of defining routes, usefull for when we want the app variable
// e.g. using app.route('foo') and defining both GET and POST actions on it
//require('./routes/login')(app);


// Other Routes
// -----------------------------------------

// REGISTER other routes to the application
// Must come last. The route is a 303 redirect to root
app.use('/*', otherRoutes.otherRouter); // must come last



// =========================================
// OTHER STUFF
// =========================================



// =========================================
// START THE SERSVER
// =========================================

app.listen(port);
console.log('[~console] 1337 is the magic port!');
