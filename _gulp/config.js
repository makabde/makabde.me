const paths = {
  src: 'src',
  build: {
    base: 'build',
    dev: {
      base: 'build/development',
      assets: 'build/assets'
    },
    prod: {
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
          paths.build.dev.base,
          paths.build.base,
          paths.src
        ]
      },
      open: false,
      port: 9999,
      files: [
        `${paths.build.dev.assets}/stylesheets/*.css`,
        `${paths.build.dev.assets}/javascripts/*.js`,
        `${paths.build.dev.assets}/images/**/*`
      ]
    },
    prod: {
      server: {
        baseDir: [ paths.build.prod ]
      },
      port: 9998
    }
  },
  del: {
    src: paths.build.dev.assets
  },
  watch: {
    jekyll: [
      '_config.yml',
      '_config.build.yml',
      `${paths.src}/_data/**/*.{json,yml,csv}`,
      `${paths.src}/_includes/**/*.{html,xml}`,
      `${paths.src}/_layouts/*.html`,
      `${paths.src}/_locales/*.yml`,
      `${paths.src}/_plugins/*.rb`,
      `${paths.src}/_posts/*.{markdown,md}`,
      `${paths.src}/**/*.{html,markdown,md,yml,json,txt,xml}`,
      `${paths.src}/*`,
  },
  jekyll: {
    src: paths.src,
    dev: {
      dest: paths.build.dev.base,
      config: '_config.yml'
    },
    prod: {
      dest: paths.build.prod.base,
      config: '_config.yml,_config.build.yml'
    }
};
