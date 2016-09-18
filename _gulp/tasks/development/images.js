'use-strict';

const gulp    = require('gulp');
const changed = require('gulp-changed');

const config  = require('../../config').images;

/**
 * Copy images to build folder if not changed
 */

gulp.task('images', () => {
  gulp.src(config.src)
    // Ignore unchanged files
    .pipe(changed(config.dest))
    .pipe(gulp.dest(config.dest));
});
