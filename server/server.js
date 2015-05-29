var express = require('express');
var routes = require('./routes/main');

var app = express();

app.use(express.static(__dirname + '/../public'));


// Login Routes =============================
// ==========================================

// Another way of defining routes, usefull for when we want the app variable
// e.g. using app.route('foo') and defining both GET and POST actions on it
require('./routes/login')(app);


// API Routes ===============================
// ==========================================

// Apply the routers to the application
app.use('/api', routes.apiRoutes);
app.use('*', routes.otherRoutes); // must come last


//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');

app.listen(1337);

console.log('1337 is the magic port!');

