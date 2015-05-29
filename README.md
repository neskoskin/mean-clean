# MEAN clean app

MEAN project configuration I use for development. Contains the directory structure and uses Gulp for js and less processing (bundling, ugli/minificaiton) and nodemon for running the express server.

The project structure in summary:

- `client` contains client-side code (styles/scripts) used in development. 

- `server` contains all the Node scripts.

- `public` contains the final scripts/styles/markup exposed to the front-end (scripts/styles are produced after Gulp processing).

- `stash` contains duplicates/notes etc.

- `build` contains intermediary processed files from the `client` directory.

Gulp will watch for file changes in `client`, run the necessary tasks and populate the respective `public` and `build` folders. Gulp/nodemon also watches for changes in `server` and restart the express server. Pretty neat for development. More detailed descriptions of each folder have been included in the corresponding `README.md` files, where I felt the need to explain further.

### Usage

To initialise a new project:

```
$ cd project_directory
$ git clone https://github.com/chriskmnds/mean-clean.git .
$ npm install --save-dev jshint-stylish gulp gulp-util gulp-jshint gulp-autoprefixer gulp-browserify gulp-concat gulp-less gulp-minify-css gulp-rename gulp-uglify gulp-nodemon express angular

```

To run the project simply execute `gulp` inside the project folder.
