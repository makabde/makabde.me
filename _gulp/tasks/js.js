import gulp         from 'gulp';

import browserify   from 'browserify';
import source       from 'vinyl-source-stream';
import watchify     from 'watchify';

import bundleLogger from '../util/bundle-logger';
import handleErrors from '../util/handle-errors';

import browserSync  from 'browser-sync';
import config       from '../config';


/**
 * Run Javascripts through Browserify
 */

const jsConfig = config.javascripts;

gulp.task('js:dev', ['eslint:dev'], (cb) => {

  browserSync.notify('Compiling Javascripts');

  let bundleQueue = jsConfig.bundleConfigs.length;

  let browserifyThis = (bundleConfig) => {
    let bundler = browserify({
      // Required watchify args
      cache: {},
      packageCache: {},
      fullPaths: false,

      // Specify the entry point of the site Sources
      entries: bundleConfig.entries,

      // Add file extensions to make optional in the 'require' statements
      extensions: jsConfig.extensions,

      // Enable source maps
      debug: jsConfig.debug
    });

    let bundle = () => {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      bundler
        .bundle()
        // Report compilation errors
        .on('error', handleErrors)
        // Use 'vinyl-source-stream' to make the stream gulp compatible. Specify
        // the desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('finish', reportFinished);
    };

    if (global.isWatching) {
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler);
      // Rebundle on update
      bundler.on('update', bundle);
    }

    let reportFinished = () => {
      // Log when bunding completes
      bundleLogger.end(bundleConfig.outputName);

      if (bundleQueue) {
        bundleQueue--;

        if (bundleQueue === 0) {
          // If the queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          cb();
        }
      }
    };

    bundle();
  };

  // Start bunding with browserify for each bundleConfig specified.
  jsConfig.bundleConfigs.forEach(browserifyThis);
});
