// =======================================================
//	-----------------------------
//	GULP Build Script
//	-----------------------------	
//	Author: Christos Koumenides
//	Javascirpt bundling/uglifying
//	CSS bundling/minifying
// =======================================================

// =======================================================
// If we want to load different app bundles for each page,
// then repeat the browserify/bundle and uglify tasks
// and update the final watch task.
// Rename the folders/tasks/pipes accordingly.
// =======================================================


// Gulp dependencies
var gulp  = require('gulp');
var rename = require('gulp-rename');

// Development Dependencies
var jshint = require('gulp-jshint');

// Build Dependencies
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Express Server
var express = require('express');
var nodemon = require('gulp-nodemon');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Package.json variables
//var p = require('./package.json')
//var name = p.name;

//var x = require('angular');

/*************************************************************/
/************** JAVASCRIPT ***********************************/
/*************************************************************/

// -------------------------------------
// JSHINT 
// -------------------------------------

// configure the jshint task

gulp.task('jshint', function() {
  return gulp.src('client/scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// -------------------------------------
// BROWSERIFY
// -------------------------------------

// Compile everything required in 'index.js' into "listiit.js"
// index.js contains all the required scripts from "client/scripts/app/"
// This approach may cause problems in Angular if scripts are scattered across multiple files

// Main scripts of the package
gulp.task('browserify-app', ['jshint'], function() {
  return gulp.src('client/scripts/app.index.js')
    .pipe(browserify())
    .pipe(rename('app.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/app'));
});

// Other scripts that do not belong to the main package
gulp.task('browserify-other', ['jshint'], function() {
  return gulp.src('client/scripts/other.index.js')
    .pipe(browserify())
    .pipe(rename('other.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/assets/js'));
});

// -------------------------------------
// BUNDLE SCRIPTS - No browserify quirks
// -------------------------------------

// Main/app scripts
gulp.task('bundle-app', ['jshint'], function() {
	return gulp.src('client/scripts/app/**/*.js')
	.pipe(concat('app.js'))
	.pipe(gulp.dest('build'))
	.pipe(gulp.dest('public/app'));
});

// Other scripts that do not belong to the main/app package ((possibly page configuration))
gulp.task('bundle-other', ['jshint'], function() {
	return gulp.src('client/scripts/other/**/*.js')
	.pipe(concat('other.js'))
	.pipe(gulp.dest('build'))
	.pipe(gulp.dest('public/assets/js'));
});

// -------------------------------------
// UGLIFY
// -------------------------------------

// Uglify "foo.js" and place in public/scripts
// Using either 'bundle-*' or 'browserify-*'
// Bundle prefered for Angular applications

// Main scripts of the package
gulp.task('uglify-app', ['bundle-app'], function() {
  return gulp.src('build/app.js')//gulp.src('build/' + name + '.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))//.pipe(rename(name + '.min.js'))
    .pipe(gulp.dest('public/app'));
});

// Other scripts that do not belong to the main package
gulp.task('uglify-other', ['bundle-other'], function() {
  return gulp.src('build/other.js')
    .pipe(uglify())
    .pipe(rename('other.min.js'))
    .pipe(gulp.dest('public/assets/js'));
});

/*************************************************************/
/************** STYLESHEET ***********************************/
/*************************************************************/

// TODO: change renaming of styles in client/styles/other/less accordingly

// -------------------------------------
// LESS INTERPRETER / BUNDLE
// -------------------------------------

// Main application styles
gulp.task('styles-app-less', function() {
  return gulp.src('client/styles/app/less/**/*.less')
	.pipe(concat('app.css'))//.pipe(concat(name + '.css'))
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/assets/css'));
});

// Other styles not part of main app
gulp.task('styles-other-less', function() {
  return gulp.src('client/styles/other/less/**/*.less')
    .pipe(concat('other.css'))
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/assets/css'));
});

// -------------------------------------
// MINIFY CSS
// -------------------------------------

// Minify main application styles
gulp.task('minify-app', ['styles-app-less'], function() {
  return gulp.src('build/app.css')//gulp.src('build/' + name + '.css')
    .pipe(minifyCSS())
    .pipe(rename('app.min.css'))//.pipe(rename(name + '.min.css'))
    .pipe(gulp.dest('public/assets/css'));
});

// Minify other application styles
gulp.task('minify-other', ['styles-other-less'], function() {
  return gulp.src('build/other.css')
    .pipe(minifyCSS())
    .pipe(rename('other.min.css'))
    .pipe(gulp.dest('public/assets/css'));
});

/*************************************************************/
/**************** WATCH **************************************/
/*************************************************************/

gulp.task('watch', function() {
	gulp.watch('client/scripts/app/**/*.js', ['uglify-app']);
	gulp.watch('client/scripts/other/**/*.js', ['uglify-other']);
	gulp.watch('client/styles/app/less/**/*.less', ['minify-app']);
	gulp.watch('client/styles/other/less/**/*.less', ['minify-other']);
});

/*************************************************************/
/************** WEB SERVER ***********************************/
/*************************************************************/

/*gulp.task('express', function () {
	var server = express();
	server.use(express.static('public'));
	server.listen(8081);
});*/

gulp.task('nodemon', function() {
	nodemon({
		varbose: true,
		script: 'server/server.js',
		ext: 'js json',
		watch: 'server',
		env: { 'NODE_ENV': 'development' }
	})
		//.on('start', ['watch'])
		//.on('change', function() {console.log('STARTED');})
		.on('restart', function() {
			console.log('[~console] Server restarted!');
		});
});

/*************************************************************/
/**************** DEFAULT ************************************/
/*************************************************************/

// main Gulp task
//gulp.task('default', ['watch', 'express']);
gulp.task('default', ['nodemon', 'watch']);

