'use strict';

const gulp     = require('gulp');
const scssLint = require('gulp-scss-lint');

const config   = require('../../config');

/**
 * Lint the scss files before compilation
 */

gulp.task('scss-lint', () => {
  gulp.src(config.stylesheets.src)
    .pipe(scssLint(config.scssLint.options));
});
