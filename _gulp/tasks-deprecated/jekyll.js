import gulp         from 'gulp';
import browserSync  from 'browser-sync';
import childProcess from 'child_process';

import config       from '../config';

/**
 * Build the Jekyll site
 */

const spawn = childProcess.spawn;
const jekyllDevConfig = config.jekyll.development;
const jekyllProdConfig = config.jekyll.production;

gulp.task('jekyll:dev', (done) => {
  browserSync.notify('Compiling Jekyll');

  spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      '--source=' + jekyllDevConfig.src,
      '--destination=' + jekyllDevConfig.dest,
      '--config=' + jekyllDevConfig.config
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});

gulp.task('jekyll-rebuild:dev', ['jekyll'], () => {
  browserSync.reload();
});

gulp.task('jekyll:prod', (done) => {
  browserSync.notify('Compiling Jekyll');

  return spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      '--source=' + jekyllProdConfig.src,
      '--destination=' + jekyllProdConfig.dest,
      '--config=' + jekyllProdConfig.config
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});
