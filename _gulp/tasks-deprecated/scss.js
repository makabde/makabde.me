import gulp         from 'gulp';
import postcss      from 'gulp-postcss';
import sass         from 'gulp-sass';
import sourcemaps   from 'gulp-sourcemaps';

import browserSync  from 'browser-sync';

import autoprefixer from 'autoprefixer';

import config       from '../config';

/**
 * Build the stylesheets
 */

const processors = [
  autoprefixer(config.stylesheets.options.autoprefixer),
];

gulp.task('scss:dev', ['scss-lint:dev'], () => {
  browserSync.notify('Compiling stylesheets');

  gulp.src(config.stylesheets.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths: config.stylesheets.includePaths }).on(
      'error', sass.logError
    ))
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.stylesheets.dest));
});