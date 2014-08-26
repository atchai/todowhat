var source = require('vinyl-source-stream')
var streamify = require('gulp-streamify')
var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulp = require('gulp')

gulp.task('default', function() {
  var bundleStream = browserify('./js/app.js').bundle()

  bundleStream
    .pipe(source('bundle.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./'))
});