var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulp = require('gulp')
var karma = require('karma').server;

//default gulp task browserifies application js files in bundle and minifies js
gulp.task('default', function() {
  var bundleStream = browserify('./js/app.js').bundle()

  bundleStream
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./'))
});

//this task browserifies jasmine test specs
gulp.task('browserify-test', function() {
    return browserify('./tests/specs.js')
        .bundle()
        .pipe(source('testFile.js'))
        .pipe(gulp.dest('./tests/'));
});
//this task runs test with karma after test specs have been bundled
gulp.task('test', ['browserify-test'], function (done) {
  karma.start({
    configFile: __dirname + '/tests/my.conf.js',
    singleRun: true
  }, done);
});