import gulp     from 'gulp';
import scssLint from 'gulp-scss-lint';

import config   from '../config';

/**
 * Lint the scss files before compilation
 */

gulp.task('scss-lint:dev', () => {
  gulp.src(config.stylesheets.src)
    .pipe(scssLint(config.lint.stylesheets.options));
});
