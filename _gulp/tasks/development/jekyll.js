import gulp         from 'gulp';
import browserSync  from 'browser-sync';
import childProcess from 'child_process';

import config       from '../../config';

/**
 * Build the Jekyll site
 */

const spawn = childProcess.spawn;
const jekyllConfig = config.jekyll.development;

gulp.task('jekyll', (done) => {
  browserSync.notify('Compiling Jekyll');

  spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      '--source=' + jekyllConfig.src,
      '--destination=' + jekyllConfig.dest,
      '--config=' + jekyllConfig.config
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], () => {
  browserSync.reload();
});
