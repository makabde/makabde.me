import gulp from 'gulp';
import gulpIf from 'gulp-if';
import gulpPostcss from 'gulp-postcss';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpUtil from 'gulp-util';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cp from 'child_process';
import cssnano from 'cssnano';
import del from 'del';
import minimist from 'minimist';
import runSequence from 'run-sequence';

import config from '../config';

const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'production' }
};

const options = minimist(process.argv.slice(2), knownOptions);

/**
 * Default task
 */
gulp.task('default', ['watch']);

/**
 * Watch task
 *
 * This task does not come with `:dev` nor a `:prod` prefix as it used only in
 * development. CI should never have access to this task
 */
gulp.task('watch', ['browserSync:dev'], callback => {
  if (options.env === 'production') {
    callback('Attempted to run watch task in production');
  }

  let watchConfig = config.watch;

  gulp.watch(watchConfig.jekyll, ['jekyll:rebuild']);
  gulp.watch(watchConfig.stylesheets), ['stylesheets'];
});

/**
 * BrowserSync tasks
 */
gulp.task('browserSync:dev', ['build:dev'], () => {
  browserSync(config.browserSync.dev);
});

gulp.task('browserSync:prod', ['build:prod'], () => {
  browserSync(config.browserSync.prod);
});

/**
 * Build tasks
 */
gulp.task('build:dev', callback => {
  runSequence(
    'delete',
    [ 'jekyll', 'stylesheets' ],
    callback
  );
});

gulp.task('build:prod', () => {
});

/**
 * Delete task
 */
gulp.task('delete', () => {
  let delConfig = config.del;

  del(delConfig.src).then(paths => {
    gulpUtil.log('Deleted files and folders:\n', paths.join('\n'));
  });
});

/**
 * Jekyll tasks
 */
gulp.task('jekyll:rebuild', ['jekyll'], () => {
  browserSync.reload();
});

gulp.task('jekyll', done => {
  browserSync.notify('Compiling Jekyll');

  let _config;
  if (options.env === 'production') {
    _config = config.jekyll.prod;
  } else {
    _config = config.jekyll.dev;
  }

  cp.spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      `--source=${config.jekyll.src}`,
      `--destination=${_config.dest}`,
      `--config=${_config.config}`
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});

/**
 * Stylesheets tasks
 */

gulp.task('stylesheets', () => {
  browserSync.notify('Compiling stylesheets');

  let _config;
  if (options.env === 'production') {
    _config = config.stylesheets.prod;
  } else {
    _config = config.stylesheets.dev;
  }

  let _processors = [
    autoprefixer(config.stylesheets.processors.autoprefixer)
  ];

  gulp.src(config.stylesheets.src)
    .pipe(gulpSourcemaps.init())
    .pipe(gulpSass({
      includePaths: config.stylesheets.includePaths
    }).on('error', gulpSass.logError))
    .pipe(gulpPostcss(_processors))
    .pipe(gulpIf(options.env === 'production', cssnano()))
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(_config.dest));
});
