import gulp from 'gulp';
import gulpBase64 from 'gulp-base64';
import gulpChanged from 'gulp-changed';
import gulpGzip from 'gulp-gzip';
import gulpIf from 'gulp-if';
import gulpImagemin from 'gulp-imagemin';
import gulpPostcss from 'gulp-postcss';
import gulpRev from 'gulp-rev';
import gulpRevCollector from 'gulp-rev-collector';
import gulpRevDelete from 'gulp-rev-delete-original';
import gulpSass from 'gulp-sass';
import gulpSize from 'gulp-size';
import gulpSourcemaps from 'gulp-sourcemaps';
import gulpSvgmin from 'gulp-svgmin';
import gulpWebp from 'gulp-webp';

import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import cp from 'child_process';
import del from 'del';
import minimist from 'minimist';

import config from './_gulp/config';

/**
 * Environment variables
 */

const knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

const options = minimist(process.argv.slice(2), knownOptions);


const _browserSync = browserSync.create('dev');

/**
 * Jekyll
 *
 * Checks for the current environment in which gulp is running in order define
 * where to output the compiled Jekyll files; and then compile Jekyll.
 */

gulp.task('jekyll', done => {
  _browserSync.notify('Compiling Jekyll');

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
  _browserSync.notify('Compiling stylesheets');

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
 * Optimise
 *
 * 1. Optimise CSS
 * 2. Optimise images
 * 3. Optimise svg's
 */
gulp.task('optimise:css', done => {
  let _config = config.optimise.css;
  let _processors = [
    cssnano()
  ];

  let _stream = gulp.src(_config.src)
    .pipe(gulpPostcss(_processors))
    .pipe(gulpSize())
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

gulp.task('optimise:images', done => {
  let _config = config.optimise.images;

  let _stream = gulp.src(_config.src)
    .pipe(gulpImagemin(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

gulp.task('optimise:vectors', done => {
  let _config = config.optimise.vectors;

  let _stream = gulp.src(_config.src)
    .pipe(gulpSvgmin())
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Rev
 *
 * 1. Revision all assets files and write a manifest file.
 * 2. Replace all links to assets in files from a manifest file.
 */

gulp.task('rev', done => {
  let _config = config.revision;

  let _stream = gulp.src(_config.src.assets, { base: _config.src.base })
    .pipe(gulp.dest(_config.dest.assets))
    .pipe(gulpRev())
    .pipe(gulpRevDelete())
    .pipe(gulp.dest(_config.dest.assets))
    .pipe(gulpRev.manifest(_config.manifest.options))
    .pipe(gulp.dest(_config.manifest.path));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

gulp.task('rev:collector', done => {
  let _config = config.revision.collect;

  let _stream = gulp.src(_config.src)
    .pipe(gulpRevCollector())
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

/**
 * Compress
 *
 * 1. Gzip text files
 * 2. Convert images to WebP
 */

gulp.task('compress:gzip', done => {
  let _config = config.compress.gzip;

  let _stream = gulp.src(_config.src)
    .pipe(gulpGzip(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => {
    done();
  });

  _stream.on('error', error => {
    done(error);
  });
});

gulp.task('compress:webp', done => {
  let _config = config.compress.webp;

  let _stream = gulp.src(_config.src)
    .pipe(gulpWebp(_config.options))
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

gulp.task('build:prod:compress', gulp.parallel(
  'compress:gzip',
  'compress:webp',
  done => {
    done();
  }
));

gulp.task('build:prod:optimise', gulp.parallel(
  'optimise:css',
  'optimise:images',
  'optimise:vectors',
  done => {
    done();
  }
));

gulp.task('build:prod', gulp.series(
  'delete',
  'jekyll',
  'build:dev:assets',
  'base64',
  'build:prod:optimise',
  'rev',
  'rev:collector',
  'build:prod:compress',
  done => {
    done();
  }
));

/**
 * BrowserSync
 */

gulp.task('browserSync:dev', gulp.series('build:dev', done => {
  _browserSync.init(config.browserSync.dev, done());
}));

gulp.task('browserSync:reload', done => {
  _browserSync.reload();
  done();
});

// gulp.task('browserSync:prod', gulp.series('build:prod', done => {
//   let _browserSync = browserSync.create('prod');
//
//   _browserSync.init(config.browserSync.prod, done());
// }));

/**
 * Watch
 */

gulp.task('watch:jekyll', () => {
  gulp.watch(config.watch.jekyll, gulp.series('jekyll', 'browserSync:reload'));
});

gulp.task('watch:stylesheets', () => {
  gulp.watch(config.watch.stylesheets, gulp.series('stylesheets'));
});

gulp.task('watch:images', () => {
  gulp.watch(config.watch.images, gulp.series('images'));
});

gulp.task('watch:vectors', () => {
  gulp.watch(config.watch.vectors, gulp.series('vectors'));
});

gulp.task('watch', gulp.parallel(
  'watch:jekyll',
  'watch:stylesheets',
  'watch:images',
  'watch:vectors'
));

/**
 * Default task
 */

gulp.task('default', gulp.series('browserSync:dev', 'watch'));

/**
 * Publish task
 */

gulp.task('publish', gulp.series('build:prod', done => {
  done();
}));
