'use strict';

import gulp        from 'gulp';
import runSequence from 'run-sequence';

/**
 * Run all tasks needed for a build in a defined order
 */

gulp.task('build', (callback) => {
  runSequence('delete',
    [
      'jekyll',
      'scss',
      'js',
      'images'
    ],
    'base64',
    callback
  );
});
