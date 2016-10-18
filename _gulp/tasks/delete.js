import gulp   from 'gulp';
import util   from 'gulp-util';
import del    from 'del';

import config from '../config';

/**
 * Delete folders and files
 */

const delConfig = config.delete;

gulp.task('delete:dev', () => {
  del(delConfig.src, delConfig.options).then(paths => {
    util.log('Deleted files and folders:\n', paths.join('\n'));
  });
});
