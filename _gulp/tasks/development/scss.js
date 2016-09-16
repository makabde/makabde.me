'use strict';


const gulp         = require('gulp');
const cssnano      = require('gulp-cssnano');
const postcss      = require('gulp-postcss');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');

const browserSync  = require('browser-sync');

const autoprefixer = require('autoprefixer');
const mqpacker     = require('css-mqpacker');
const precss       = require('precss');

const config       = require('../../config');

/**
 * Build the stylesheets
 */

const processors = [
  precss(config.stylesheets.options.precss),
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
