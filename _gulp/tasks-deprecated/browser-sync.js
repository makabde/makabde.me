import gulp        from 'gulp';
import browserSync from 'browser-sync';

import config      from '../config';

/**
 * Run the build task and start a server with BrowserSync
 */

const bsDevConf = config.browserSync.development;
const bsProdConf = config.browserSync.production;

gulp.task('browser-sync:dev', ['build:dev'], () => {
  browserSync(bsDevConf);
});

gulp.task('browserSync:prod', ['build:prod'], () => {
  browserSync(bsProdConf);
});
