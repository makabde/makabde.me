'use strict';

const gulp        = require('gulp');
const browserSync = require('browser-sync');
const config      = require('../../config').browserSync.development;

/**
 * Run the build task and start a server with BrowserSync
 */

gulp.task('browser-sync', ['build'], () => {
  browserSync(config);
});
