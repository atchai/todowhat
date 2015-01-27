var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var karma = require('karma').server;
var watchify = require('watchify');

//default gulp task browserifies application js files in bundle and minifies js
gulp.task('default', function() {
  var bundleStream = browserify('./todowhat/static/js/app.js').bundle()
  bundleStream
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./todowhat/static/'))
});

//this task watches for changes application js files and compiles them
gulp.task('watch', function(){
	watch = true;
  browserifySetup('./todowhat/static/js/app.js', 'bundle.js', './todowhat/static/');
});

//this task watches for changes application js files and compiles jasmine test specs
gulp.task('watch-compile-test', function(){
	watch = true;
  browserifySetup('./todowhat/static/tests/specs.js', 'testFile.js', './todowhat/static/tests/');
});

//this task just compiles jasmine test specs
gulp.task('nowatch-compile-test', function(){
	watch = false;
  browserifySetup('./todowhat/static/tests/specs.js', 'testFile.js', './todowhat/static/tests/');
});

//this task runs tests with karma after test specs have been bundled and again if changed
gulp.task('watch-test', ['watch-compile-test'], function (done) {
  karma.start({
    configFile: __dirname + '/todowhat/static/tests/my.conf.js',
    action: 'watch'
  }, done);
});

//this task runs tests with karma after test specs have been bundled
gulp.task('test', ['nowatch-compile-test'], function (done) {
  karma.start({
    configFile: __dirname + '/todowhat/static/tests/my.conf.js'
  }, done);
});


function browserifySetup(inputFile, outputFile, outputPath){
  //need to pass these three config options to browserify
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  //use watchify is watch flag set to true
  if (watch) {
	  //wrap watchify around browserify
	  b = watchify(b);

	  //compile the files when there is a change saved
	  b.on('update', function(){
	    buildFiles(b, outputFile, outputPath);
	  });
  }

  b.add(inputFile);
  buildFiles(b, outputFile, outputPath);
}

function buildFiles(b, outputFile, outputPath) {
  b.bundle()
    .on('error', function(err){
        console.log(err.message);
        this.end();
      })
    .pipe(source(outputFile))
    .pipe(gulp.dest(outputPath));
}
