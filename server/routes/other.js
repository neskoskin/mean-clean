var express = require('express');
var path = require('path');

// =================================
// Else Route
// =================================

// This is the last route applied in server.js
// It will collect all requests that do not match
// a route and redirect (303 See Other) to homepage.

var otherRouter = express.Router();

// will match all
otherRouter.get('*', function(req,res) {
	//console.log(req.method + " " + req.path);
	res.redirect(303, '/');
});


// ---------------------------------
// EXPORT the route
// ---------------------------------

module.exports = {
	otherRouter: otherRouter
}