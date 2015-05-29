# MEAN clean app

MEAN project configuration I use for development. Contains the directory structure and uses Gulp for js and less processing (bundling, ugli/minificaiton) and nodemon for running the express server. Brief descriptions of each folder placed in the corresponding `README.md` files.

`client` contains client-side code (styles/scripts) used in development. 

`server` contains all the Node scripts.

`public` contains the final scripts/styles/markup exposed to the front-end (scripts/styles are produced after Gulp processing).

`stash` contains duplicates/notes etc.

`build` contains intermediary processed files from the `client` directory.

### Usage

To initialise a new project:

```
$ cd project_name
$ git clone https://github.com/chriskmnds/mean-clean.git .
$ npm install --save-dev jshint-stylish gulp gulp-util gulp-jshint gulp-autoprefixer gulp-browserify gulp-concat gulp-less gulp-minify-css gulp-rename gulp-uglify gulp-nodemon express angular

```
