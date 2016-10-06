'use strict';

import gulp         from 'gulp';
import cssnano      from 'gulp-cssnano';
import postcss      from 'gulp-postcss';
import sass         from 'gulp-sass';
import sourcemaps   from 'gulp-sourcemaps';

import browserSync  from 'browser-sync';

import autoprefixer from 'autoprefixer';
import mqpacker     from 'css-mqpacker';

import config       from '../../config';

/**
 * Build the stylesheets
 */

const processors = [
  autoprefixer(config.stylesheets.options.autoprefixer),
  mqpacker(config.stylesheets.options.mqpacker)
];

gulp.task('scss', ['scss-lint'], () => {
  browserSync.notify('Compiling stylesheets');

  gulp.src(config.stylesheets.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.stylesheets.dest));
});
