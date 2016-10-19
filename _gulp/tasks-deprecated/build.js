import gulp        from 'gulp';
import runSequence from 'run-sequence';

/**
 * Run all tasks needed for a build in a defined order
 */

gulp.task('build:dev', (callback) => {
  runSequence(
    'delete',
    [ 'jekyll:dev', 'scss:dev', 'js:dev', 'images:dev', 'vectors:dev' ],
    'base64:dev',
    callback
  );
});

gulp.task('build:prod', (callback) => {
  runSequence(
    'delete',
    'jekyll:prod',
    callback
  );
});