const paths = {
  src: 'src',
  build: {
    base: 'build',
    development: {
      base: 'build/development',
      assets: 'build/assets'
    },
    production: {
      base: 'build/production',
      assets: 'build/production/assets'
    }
  }
};

export default {
  browserSync: {
    dev: {
      server: {
        baseDir: [
          paths.build.development.base,
          paths.build.base,
          paths.src
        ]
      },
      open: false,
      port: 9999,
      files: [
        `${paths.build.development.assets}/stylesheets/*.css`,
        `${paths.build.development.assets}/javascripts/*.js`,
        `${paths.build.development.assets}/images/**/*`
      ]
    },
    prod: {
      server: {
        baseDir: [ paths.build.production ]
      },
      port: 9998
    }
  },
  del: {
    src: paths.build.development.assets
  }
};
