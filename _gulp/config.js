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
  clean: {
    assets: paths.build.dev.assets,
    development: paths.build.dev.base,
    production: paths.build.prod.base
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
    stylesheets: `${paths.stylesheets}/**/*.scss`,
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
      cssnext: {
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
    html: {
      src: `${paths.build.prod.base}/**/*.html`,
      dest: paths.build.prod.base,
      options: {
        collapseWhitespace: true
      }
    },
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
  },
  revision: {
    src: {
      assets: [
        `${paths.build.prod.assets}/stylesheets/*.css`,
        `${paths.build.prod.assets}/images/**/*`
      ],
      base: paths.build.prod.base
    },
    dest: {
      assets: paths.build.prod.base
    },
    manifest: {
      options: {
        path: 'manifest.json',
        merge: true
      },
      path: paths.build.prod.assets,
    },
    collect: {
      src: [
        `${paths.build.prod.assets}/manifest.json`,
        `${paths.build.base}/**/*.{html,xml,txt,json,css,js}`,
        `!${paths.build.base}/feed.xml`
      ],
      dest: paths.build.base
    }
  },
  compress: {
    gzip: {
      src: [
        `${paths.build.prod.base}/**/*.{css,html,json,js,xml}`,
        `!${paths.build.prod.base}/browsersync.xml`,
        `!${paths.build.prod.base}/feed.xml`,
        `!${paths.build.prod.base}/sitemap.xml`,
        `!${paths.build.prod.assets}/manifest.json`
      ],
      dest: paths.build.prod.base,
      options: {}
    },
    webp: {
      src: `${paths.build.prod.assets}/images/**/*.{jpg,jpeg,png}`,
      dest: `${paths.build.prod.assets}/images`,
      options: {}
    }
  }
};
