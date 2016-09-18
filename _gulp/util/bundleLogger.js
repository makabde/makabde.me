/**
 * bundleLogger
 *
 * Provides gulp style logs to the bundle method in browserify.js
 */

const gutil        = require('gulp-util');
const prettyHrtime = require('pretty-hrtime');

let startTime;

module.exports = {
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