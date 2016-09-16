'use strict';

const gulp        = require('gulp');
const spawn       = require('child_process').spawn;
const browserSync = require('browser-sync');
const config      = require('../../config').jekyll.development;

/**
 * Build the Jekyll site
 */


gulp.task('jekyll', (done) => {
  browserSync.notify('Compiling Jekyll');

  spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      '--source=' + config.src,
      '--destination=' + config.dest,
      '--config=' + config.config
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], () => {
  browserSync.reload();
});
