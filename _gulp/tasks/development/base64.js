'use-strict';

const gulp   = require('gulp');
const base64 = require('gulp-base64');

const config = require('../../config').base64;

/**
 * Replace urls in CSS files with base64 encoded data
 */

gulp.task('base64', ['scss'], () => {
  gulp.src(config.src)
    .pipe(base64(config.options))
    .pipe(gulp.dest(config.dest));
});
