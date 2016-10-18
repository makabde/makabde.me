import gulp   from 'gulp';

import config from '../config';

/**
 * Start browserSync task and then watch files for changes
 */

const watchConfig = config.watch;

gulp.task('watch:dev', ['browser-sync:dev'], () => {
  gulp.watch(watchConfig.jekyll,       ['jekyll-rebuild:dev']);
  gulp.watch(watchConfig.stylesheets,  ['scss:dev']);
  gulp.watch(watchConfig.javascripts,  ['js:dev']);
  gulp.watch(watchConfig.images,       ['images:dev']);
  gulp.watch(watchConfig.vectors,      ['vectors:dev']);
});
