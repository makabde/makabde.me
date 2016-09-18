'use strict';

const gulp        = require('gulp');
const runSequence = require('run-sequence');

/**
 * Run all tasks needed for a build in a defined order
 */

gulp.task('build', (cb) => {
  runSequence('delete',
    [
      'jekyll',
      'scss',
      'js',
      'images'
    ],
    'base64',
    cb
  );
});
