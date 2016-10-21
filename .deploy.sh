#!/bin/sh

# Only run when the script was not started by a pull request

if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "PR, exiting"
  exit 0
fi

# Enable console error reporting

set -e

# Run the Gulp build tasks

npm run build
gulp deploy --env production
