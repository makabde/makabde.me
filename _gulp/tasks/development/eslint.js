import gulp   from 'gulp';
import eslint from 'gulp-eslint';

import config from '../../config';


/**
 * Lint javascripts with ESLint
 */

const linterConfig = config.lint.javascripts;

gulp.task('eslint', () => {
  gulp.src(linterConfig.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
