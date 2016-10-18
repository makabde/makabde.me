import gulp   from 'gulp';

import config from '../../config';

/**
 * Start browserSync task and then watch files for changes
 */

const watchConfig = config.watch;

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch(watchConfig.jekyll,       ['jekyll-rebuild']);
  gulp.watch(watchConfig.stylesheets,  ['scss']);
  gulp.watch(watchConfig.javascripts,  ['js']);
  gulp.watch(watchConfig.images,       ['images']);
  gulp.watch(watchConfig.vectors,      ['vectors']);
});
