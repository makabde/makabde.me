import gulp        from 'gulp';
import browserSync from 'browser-sync';

import config      from '../../config';

/**
 * Run the build task and start a server with BrowserSync
 */

const browserSyncConfig = config.browserSync.development;

gulp.task('browser-sync', ['build'], () => {
  browserSync(browserSyncConfig);
});
