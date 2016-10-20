const paths = {
  src: 'src',
  stylesheets: 'src/_scss',
  images: 'src/_images',
  vectors: 'src/_svg',
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
          paths.build.base
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
        baseDir: [ paths.build.prod.base ]
      },
      open: false,
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
    ],
    stylesheets: `${paths.stylesheets}/_scss/**/*.scss`,
    images: `${paths.images}/**/*`,
    vectors: `${paths.vectors}/**/*.svg`
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
  },
  stylesheets: {
    src: `${paths.stylesheets}/**/*.scss`,
    dest: `${paths.build.dev.assets}/stylesheets`,
    includePaths: [
      require('bourbon').includePaths,
      require('bourbon-neat').includePaths
    ],
    processors: {
      autoprefixer: {
        browsers: [
          'last 2 versions',
          'safari 5',
          'ie 9',
          'opera 12.1',
          'ios 7',
          'android 4'
        ],
        cascade: true
      }
    }
  },
  javascripts: {},
  images: {
    src: `${paths.images}/**/*`,
    dest: `${paths.build.dev.assets}/images`
  },
  base64: {
    src: `${paths.build.dev.assets}/stylesheets/**/*.css`,
    dest: `${paths.build.dev.assets}/stylesheets`,
    options: {
      baseDir: paths.build.base,
      extensions: ['png'],
      maxImageSize: 20 * 1024,
      debug: false
    }
  },
  vectors: {
    src: `${paths.vectors}/**/*.svg`,
    dest: `${paths.build.dev.assets}/images`
  },
  optimise: {
    css: {
      src: `${paths.build.dev.assets}/stylesheets/**/*.css`,
      dest: `${paths.build.prod.assets}/stylesheets`
    },
    images: {
      src: `${paths.build.dev.assets}/images/**/*.{gif,jpg,jpeg,png}`,
      dest: `${paths.build.prod.assets}/images`,
      options: {
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
      }
    },
    vectors: {
      src: `${paths.build.dev.assets}/images/**/*.svg`,
      dest: `${paths.build.prod.assets}/images`,
    }
  }
};
