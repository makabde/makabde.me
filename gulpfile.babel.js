import gulp from 'gulp';
import gulpBase64 from 'gulp-base64';
import gulpChanged from 'gulp-changed';
import gulpGzip from 'gulp-gzip';
import gulpHtmlmin from 'gulp-htmlmin';
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
import gulpUtil from 'gulp-util';
import gulpWebp from 'gulp-webp';

import browserSync from 'browser-sync';
import cp from 'child_process';
import cssnano from 'cssnano';
import del from 'del';
import postcssCssnext from 'postcss-cssnext';
import yargs from 'yargs';

/**
 * Import the Gulp tasks config
 */

import config from './_gulp/config';

/**
 * Create a BrowserSync instance and name it development.
 */

const _browserSync = browserSync.create('development');

/**
 * Create `gulp-if` constants.
 */

const _when = gulpIf;

/**
 * Create a constant for argv which will be used for getting options passed in
 * CLI.
 */

const _argv = yargs.argv;

// ========================================
// Clean
// ========================================

/**
 * `gulp clean:assets` -- Clean the content of the compiled asset folder:
 * `build/assets`.
 */

gulp.task('clean:development:assets', done => {
  del(config.clean.assets).then(paths => {
    gulpUtil.log('Deleted files and folders:\n', paths.join('\n'));
    done();
  });
});

/**
 * `gulp clean:development` -- Clean the content of the compiled development
 * folder for Jekyll: `build/development`.
 */

gulp.task('clean:development', done => {
  del(config.clean.development).then(paths => {
    gulpUtil.log('Deleted files and folders:\n', paths.join('\n'));
    done();
  });
});

/**
 * `gulp clean:production` -- Clean the content of the compiled production
 * folder: `build/production`.
 */

gulp.task('clean:production', done => {
  del(config.clean.production).then(paths => {
    gulpUtil.log('Deleted files and folders:\n', paths.join('\n'));
    done();
  });
});

/**
 * `gulp clean` -- Alias to run all the clean tasks
 */

gulp.task('clean', gulp.parallel(
  'clean:development:assets', 'clean:development', 'clean:production'
));

// ========================================
// Jekyll
// ========================================

/**
 * `gulp jekyll` -- Build the Jekyll according to the current environment. In
 * development, the site will be exported to `build/development`; while in
 * production, it will go to `build/production`.
 */

gulp.task('jekyll', done => {
  let _config = _argv.production ? config.jekyll.prod : config.jekyll.dev;

  _browserSync.notify('Compiling Jekyll');

  cp.spawn(
    'bundle',
    [
      'exec',
      'jekyll',
      'build',
      '-q',
      `--source=${config.jekyll.src}`,
      `--destination=${_config.dest}`,
      `--config=${_config.config}`,
    ],
    {
      stdio: 'inherit'
    }
  ).on('close', done);
});

// ========================================
// Stylesheets
// ========================================

/**
 * `gulp stylesheets` -- Compile the `scss` files from `src/_scss` to
 * `build/assets/stylesheets` and auto prefix the outputted stylesheets.
 *  Optionnaly write source-maps when not in production.
 */

gulp.task('stylesheets', done => {
  _browserSync.notify('Compiling stylesheets');

  let _config = config.stylesheets;
  let _processors = [
    postcssCssnext(_config.processors.cssnext)
  ];

  let _stream = gulp.src(_config.src)
    .pipe(_when(!_argv.production, gulpSourcemaps.init({ loadMaps: true })))
    .pipe(gulpSass({ includePaths: _config.includePaths }))
    .pipe(gulpPostcss(_processors))
    .pipe(_when(!_argv.production, gulpSourcemaps.write('.')))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

// ========================================
// Images
// ========================================

/**
 * `gulp images` -- Move the images from the source folder to the build
 * destination.
 */

gulp.task('images', done => {
  let _config = config.images;

  let _stream = gulp.src(_config.src)
    .pipe(_when(!_argv.production, gulpChanged(_config.dest)))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

// ========================================
// Vectors
// ========================================

/**
 * `gulp vectors` -- Move the vectors from the source folder to the build
 * destination.
 */

gulp.task('vectors', done => {
  let _config = config.vectors;

  let _stream = gulp.src(_config.src)
    .pipe(_when(!_argv.production, gulpChanged(_config.dest)))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

// ========================================
// Base 64
// ========================================

/**
 * `gulp base64` -- Turn all the css emdedded png links to a base 64 data
 * object.
 */

gulp.task('base64', done => {
  let _config = config.base64;

  let _stream = gulp.src(_config.src)
    .pipe(gulpBase64(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

// ========================================
// Build
// ========================================

/**
 * `gulp build:assets` -- Trigger all task related to assets compilation in
 * a parallel task.
 */

gulp.task('build:assets', gulp.parallel(
  'stylesheets', 'images', 'vectors'
));

/**
 * `gulp build:dev` -- Clean the development folder, build the Jekyll site, and
 * compile the assets
 */

gulp.task('build:dev', gulp.series(
  'clean',
  'jekyll',
  'build:assets',
  'base64'
));

/**
 * `gulp build` -- Alias to the `build:dev` task
 */

gulp.task('build', gulp.series('build:dev'));

// ========================================
// BrowserSync
// ========================================

/**
 * `gulp browserSync:reload` -- Reload BrowserSync.
 */

gulp.task('browserSync:reload', done => {
  _browserSync.reload();
  done();
});

/**
 * `gulp browserSync` -- Run BrowserSync to serve locally the compiled site
 * and assets.
 */

gulp.task('browserSync', done => {
  let _config = config.browserSync;

  _browserSync.init(_config, done());
});

// ========================================
// Watch
// ========================================

/**
 * `gulp watch:jekyll` -- Watch changes in the Jekyll site source and trigger
 * a compilation of the sources.
 */

gulp.task('watch:jekyll', () => {
  gulp.watch(config.watch.jekyll, gulp.series('jekyll', 'browserSync:reload'));
});

/**
 * `gulp watch:stylesheets` -- Watch changes in `src/_scss` and compile the
 * stylesheets.
 */

gulp.task('watch:stylesheets', () => {
  gulp.watch(config.watch.stylesheets, gulp.series('stylesheets'));
});

/**
 * `gulp watch:images` -- Watch changes in `src/_images`.
 */

gulp.task('watch:images', () => {
  gulp.watch(config.watch.images, gulp.series('images'));
});

/**
 * `gulp watch:vectors` -- Watch changes in `src/_images`.
 */

gulp.task('watch:vectors', () => {
  gulp.watch(config.watch.vectors, gulp.series('vectors'));
});

/**
 * `gulp watch` -- Alias to the watch tasks.
 */

gulp.task('watch', gulp.parallel(
  'watch:jekyll', 'watch:stylesheets', 'watch:images', 'watch:vectors'
));

// ========================================
// Optimise
// ========================================

/**
 * `gulp optimise:html` -- Minify the compiled Jekyll HTML files.
 */

gulp.task('optimise:html', done => {
  let _config = config.optimise.html;

  let _stream = gulp.src(_config.src)
    .pipe(gulpHtmlmin(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp optimise:css` -- Minify the compiled SCSS files.
 */

gulp.task('optimise:css', done => {
  let _config = config.optimise.css;
  let _processors = [
    cssnano()
  ];

  let _stream = gulp.src(_config.src)
    .pipe(gulpPostcss(_processors))
    .pipe(gulpSize({ showFiles: true }))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp optimise:images` -- Optimise and minify the images.
 */

gulp.task('optimise:images', done => {
  let _config = config.optimise.images;

  let _stream = gulp.src(_config.src)
    .pipe(gulpImagemin(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp optimise:vectors` -- Optimise the vectors.
 */

gulp.task('optimise:vectors', done => {
  let _config = config.optimise.vectors;

  let _stream = gulp.src(_config.src)
    .pipe(gulpSvgmin())
    .pipe(gulpSize({ showFiles: true }))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});


/**
 * `gulp optimise` -- Alias to the optimisation tasks, ran in parallel, used
 * in production only.
 */

gulp.task('optimise', gulp.parallel(
  'optimise:html', 'optimise:css', 'optimise:images', 'optimise:vectors'
));

// ========================================
// Rev
// ========================================

/**
 * `gulp rev:version` -- Append a revision number to assets filenames and write
 * a manifest file.
 */

gulp.task('rev:version', done => {
  let _config = config.revision;

  let _stream = gulp.src(_config.src.assets, { base: _config.src.base })
    .pipe(gulp.dest(_config.dest.assets))
    .pipe(gulpRev())
    .pipe(gulpRevDelete())
    .pipe(gulp.dest(_config.dest.assets))
    .pipe(gulpRev.manifest(_config.manifest.options))
    .pipe(gulp.dest(_config.manifest.path));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp rev:collect` -- Modify the html files with the revisioned assets
 * filenames.
 */

gulp.task('rev:collect', done => {
  let _config = config.revision.collect;

  let _stream = gulp.src(_config.src)
    .pipe(gulpRevCollector())
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp rev` -- Alias to the rev tasks.
 */

gulp.task('rev', gulp.series('rev:version', 'rev:collect'));

// ========================================
// Compress
// ========================================

/**
 * `gulp compress:gzip` -- Gzip text files.
 */

gulp.task('compress:gzip', done => {
  let _config = config.compress.gzip;

  let _stream = gulp.src(_config.src)
    .pipe(gulpGzip(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp compress:webp` -- Convert images to WebP.
 */

gulp.task('compress:webp', done => {
  let _config = config.compress.webp;

  let _stream = gulp.src(_config.src)
    .pipe(gulpWebp(_config.options))
    .pipe(gulp.dest(_config.dest));

  _stream.on('end', () => { done(); });
  _stream.on('error', error => { done(error); });
});

/**
 * `gulp rev` -- Alias to the compression tasks.
 */

gulp.task('compress', gulp.series('compress:gzip', 'compress:webp'));

// ========================================
// Default
// ========================================

/**
 * `gulp` -- Compile the site sources in development mode, run BrowserSync
 * and watche files for changes.
 */

gulp.task('default', gulp.series('build', 'browserSync', 'watch'));

// ========================================
// Deploy
// ========================================

/**
 * `gulp deploy --production` -- Compule the site sources in production mode,
 * and run all the optimisation related tasks.
 */

gulp.task('deploy', gulp.series('build', 'optimise', 'rev', 'compress'));
