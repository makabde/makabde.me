#!/bin/sh

# Only run when the script was not started by a pull request

if [ $TRAVIS_PULL_REQUEST == true ]; then
  echo "PR, exiting"
  exit 0
fi

# Enable console error reporting

set -e

# Run the Gulp build tasks

npm run build
gulp deploy --env production

# Cleanup

rm -rf ../makabde.github.io

# Clone the GH pages repo using GH_TOKEN for authentification

git clone https://${GH_TOKEN}@github.com/makabde/makabde.github.io ../makabde.github.io

# Copy the generated assets to the master branch

cp -R build/production/* ../makabde.github.io

# Commit and push the geneated content to the master branch
# Since the repo was cloned in write mode with token auth - we can push there

cd ../makabde.github.io
git config user.email "hello@makabde.me"
git config user.name "Mak Abdennabi"
git add -A .
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --force --quiet origin master > /dev/null 2>&1
