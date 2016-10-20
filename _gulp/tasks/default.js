import gulp from 'gulp';
import gulpBase64 from 'gulp-base64';
import gulpChanged from 'gulp-changed';
import gulpIf from 'gulp-if';
import gulpPostcss from 'gulp-postcss';
import gulpSass from 'gulp-sass';
import gulpSourcemaps from 'gulp-sourcemaps';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cp from 'child_process';
import del from 'del';
import minimist from 'minimist';

import config from '../config';


/**
 * Environment variables
 */

const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

const options = minimist(process.argv.slice(2), knownOptions);

/**
 * Jekyll
 *
 * Checks for the current environment in which gulp is running in order define
 * where to output the compiled Jekyll files; and then compile Jekyll.
 */

gulp.task('jekyll', done => {
  browserSync.notify('Compiling Jekyll');

  let _config;
  if (options.env === 'production') {
    _config = config.jekyll.prod;
  } else {
    _config = config.jekyll.dev;
  }

  cp.spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      `--source=${config.jekyll.src}`,
      `--destination=${_config.dest}`,
      `--config=${_config.config}`
    ],
    { stdio: 'inherit' }
  ).on('close', done);
});

/**
 * Stylesheets
 *
 * 1. Compiles the `scss` files to the `assets` folder
 * 2. Run the 'autoprefix-ing' plugin over the compiled output
 * 3. Writes a css map when in development
 */

gulp.task('stylesheets', done => {
  browserSync.notify('Compiling stylesheets');

  let _config = config.stylesheets;
  let _processors = [
    autoprefixer(_config.processors.autoprefixer)
  ];

  let _stream = gulp.src(_config.src)
    .pipe(gulpIf(options.env === 'development',
                  gulpSourcemaps.init({ loadMaps: true })))
    .pipe(gulpSass({ includePaths: _config.includePaths }))
    .pipe(gulpPostcss(_processors))
    .pipe(gulpIf(options.env === 'development',
                  gulpSourcemaps.write('.')))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Images
 *
 * Copy the images to the `build` assets folder.
 */

gulp.task('images', done => {
  let _config = config.images;

  let _stream = gulp.src(_config.src)
    .pipe(gulpIf(options.env === 'development', gulpChanged(_config.dest)))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Vectors
 *
 * Copy the vectors to the `build` assets folder.
 */

gulp.task('vectors', done => {
  let _config = config.vectors;

  let _stream = gulp.src(_config.src)
    .pipe(gulpIf(options.env === 'development', gulpChanged(_config.dest)))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Base 64
 *
 * Encode all PNGs to Base64 data in the stylesheet
 */

gulp.task('base64', done => {
  let _config = config.base64;

  let _stream = gulp.src(_config.src)
    .pipe(gulpBase64(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Delete
 */

gulp.task('delete', done => {
  del(config.del.src, done());
});

/**
 * Build
 */

gulp.task('build:dev:assets', gulp.parallel(
  'stylesheets',
  'images',
  'vectors',
  done => {
    done();
  }
));

gulp.task('build:dev', gulp.series(
  'delete',
  'jekyll',
  'build:dev:assets',
  'base64',
  done => {
    done();
  }
));

/**
 * BrowserSync
 */

gulp.task('browserSync:dev', gulp.series('build:dev', done => {
  let _browserSync = browserSync.create('dev');

  _browserSync.init(config.browserSync.dev, done());
}));

/**
 * Watch
 */

gulp.task('watch', gulp.series('browserSync:dev', done => {
  done();
}));

/**
 * Default task
 */

gulp.task('default', gulp.series('watch', done => {
  done();
}));
