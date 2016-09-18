'use-strict';

import gnotify from 'gulp-notify';

const handleError = () => {
  let args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify

  gnotify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Prevent gulp from hanging on this task

  this.emit('end');
};

export default handleError;
