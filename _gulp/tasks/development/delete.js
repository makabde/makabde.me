'use strict';

const gulp   = require('gulp');
const del    = require('del');
const config = require('../../config').delete;

/**
 * Delete folders and files
 */
gulp.task('delete', () => {
  del(config.src);
});
