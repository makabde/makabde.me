'use strict';

import gutil        from 'gulp-util';
import prettyHrtime from 'pretty-hrtime';

/**
 * bundleLogger
 *
 * Provides gulp style logs to the bundle method in browserify.js
 */

let startTime;

export default {

  start(filepath) {
    startTime = process.hrtime();
    gutil.log('Bundling', gutil.colors.green(filepath));
  },

  end(filepath) {
    let taskTime = process.hrtime(startTime);
    let prettyTime = prettyHrtime(taskTime);
    gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime));
  }
};
