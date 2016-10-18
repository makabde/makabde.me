import gulp    from 'gulp';
import changed from 'gulp-changed';
import svgmin  from 'gulp-svgmin';

import config  from '../../config';

/**
 * Creates a SVG sprites and fallback PNGs
 *
 * 1. Minify and clean up the outputted SVGs
 * 2. Create a sprite
 * 3. Create PNG fallbacks
 */

const vectorsConfig = config.vectors;

gulp.task('vectors', () => {
  gulp.src(vectorsConfig.src)
    // Ignore unchanged files
    .pipe(changed(vectorsConfig.dest))
    .pipe(svgmin())
    .pipe(gulp.dest(vectorsConfig.dest));
});
