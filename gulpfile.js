var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var karma = require('karma').server;
var watchify = require('watchify');

//default gulp task browserifies application js files in bundle and minifies js
gulp.task('default', function() {
  var bundleStream = browserify('./js/app.js').bundle()
  bundleStream
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./'))
});

//this task watches for changes application js files and compiles them
gulp.task('watch', function(){
  browserifySetup('./js/app.js', 'bundle.js', './');
});

//this task watches for changes application js files and compiles jasmine test specs
gulp.task('watch-test', function(){
  browserifySetup('./tests/specs.js', 'testFile.js', './tests/');
});

//this task runs tests with karma after test specs have been bundled
gulp.task('test', ['watch-test'], function (done) {
  karma.start({
    configFile: __dirname + '/tests/my.conf.js',
    action: 'watch'
  }, done);
});


function browserifySetup(inputFile, outputFile, outputPath){
  //need to pass these three config options to browserify
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  
  //wrap watchify around browserify
  b = watchify(b);

  //compile the files when there is a change saved
  b.on('update', function(){
    buildFiles(b, outputFile, outputPath);
  });
  
  b.add(inputFile);
  buildFiles(b, outputFile, outputPath);
}

function buildFiles(b, outputFile, outputPath) {
  b.bundle()
    .pipe(source(outputFile))
    .pipe(gulp.dest(outputPath));
}