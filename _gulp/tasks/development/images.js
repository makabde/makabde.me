'use strict';

import gulp    from 'gulp';
import changed from 'gulp-changed';

import config  from '../../config';

/**
 * Copy images to build folder if not changed
 */

const imagesConfig = config.images;

gulp.task('images', () => {
  gulp.src(imagesConfig.src)
    // Ignore unchanged files
    .pipe(changed(imagesConfig.dest))
    .pipe(gulp.dest(imagesConfig.dest));
});
