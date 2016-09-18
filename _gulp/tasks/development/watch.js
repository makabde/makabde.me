'use strict';

const gulp   = require('gulp');
const config = require('../../config').watch;

/**
 * Start browserSync task and then watch files for changes
 */

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch(config.jekyll, ['jekyll-rebuild']);
  gulp.watch(config.stylesheets, ['scss']);
  gulp.watch(config.javascripts, ['js']);
  gulp.watch(config.images, ['images']);
});
