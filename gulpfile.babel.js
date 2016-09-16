'use strict';

const requireDir = require('require-dir');

// Require all tasks in gulp/tasks, including subfolders

requireDir('./_gulp/tasks', { recurse: true });
