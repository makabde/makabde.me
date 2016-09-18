'use-strict';

const gulp   = require('gulp');
const eslint = require('gulp-eslint');

const config = require('../../config').lint.javascripts;

/**
 * Lint javascripts with ESLint
 */

gulp.task('eslint', () => {
  gulp.src(config.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
