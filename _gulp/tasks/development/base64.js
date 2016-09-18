'use strict';

import gulp from 'gulp';
import base64 from 'gulp-base64';

import config from '../../config';

/**
 * Replace urls in CSS files with base64 encoded data
 */

const base64Config = config.base64;

gulp.task('base64', ['scss'], () => {
  gulp.src(base64Config.src)
    .pipe(base64(base64Config.options))
    .pipe(gulp.dest(base64Config.dest));
});
