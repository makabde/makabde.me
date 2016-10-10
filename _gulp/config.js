'use strict';

const paths = {
  /* Sources */
  src: 'src',
  srcImages: 'src/_images',
  srcVectors: 'src/_vectors',
  srcJavascripts: 'src/_js',
  srcStylesheets: 'src/_scss',
  /* Build */
  // Development
  build: 'build',
  buildDevelopment: 'build/development',
  buildDevelopmentAssets: 'build/assets',
  buildDevelopmentImages: 'build/assets/images',
  buildDevelopmentJavascripts: 'build/assets/javascripts',
  buildDevelopmentStylesheets: 'build/assets/stylesheets',
  // Production
  buildProduction: 'build/production',
  buildProductionAssets: 'build/production/assets'
};

export default {
  browserSync: {
    development: {
      server: {
        baseDir: [
          paths.buildDevelopment,
          paths.build,
          paths.src
        ]
      },
      port: 9999,
      files: [
        `${paths.buildDevelopmentImages}/**`,
        `${paths.buildDevelopmentJavascripts}/*.js`,
        `${paths.buildDevelopmentStylesheets}/*.css`
      ],
      browser: 'google chrome'
    },
    production: {
      server: {
        baseDir: [ paths.buildProduction ]
      },
      port: 9998
    }
  },
  delete: {
    src: [ `${paths.buildDevelopmentAssets}/**` ]
  },
  jekyll: {
    development: {
      src: paths.src,
      dest: paths.buildDevelopment,
      config: '_config.yml'
    },
    production: {
      src: paths.src,
      dest: paths.buildProduction,
      config: '_config.yml,_config.build.yml'
    }
  },
  stylesheets: {
    src: `${paths.srcStylesheets}/**/*.scss`,
    dest: paths.buildDevelopmentStylesheets,
    includePaths: [
      'bower_components/susy/sass',
      'bower_components/breakpoint-sass/stylesheets'
    ],
    options: {
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
      },
      mqpacker: {}
    }
  },
  javascripts: {
    // Enable source maps
    debug: true,
    // Additional file extensions to make optional
    extensions: ['.hbs'],
    // A separate bundle will be generated for each bundle config in the list
    // below
    bundleConfigs: [
      {
        entries: `./${paths.srcJavascripts}/makabde.js`,
        dest: paths.buildDevelopmentJavascripts,
        outputName: 'makabde.js'
      },
      {
        entries: `./${paths.srcJavascripts}/makabde.wip.js`,
        dest: paths.buildDevelopmentJavascripts,
        outputName: 'makabde.wip.js'
      }
    ]
  },
  lint: {
    stylesheets: {
      options: {
        config: '.scss-lint.yml',
        bundleExec: true
      }
    },
    javascripts: {
      src: `${paths.srcJavascripts}/**/*.js`,
      options: {
        configFile: '.eslintrc.js'
      }
    }
  },
  images: {
    src: `${paths.srcImages}/**/*`,
    dest: paths.buildDevelopmentImages
  },
  vectors: {

  },
  base64: {
    src: `${paths.buildDevelopmentStylesheets}/**/*.css`,
    dest: paths.buildDevelopmentStylesheets,
    options: {
      baseDir: paths.build,
      extensions: ['png'],
      maxImageSize:  20 * 1024, // bytes
      debug: false
    }
  },
  sprites: {
    src: `${paths.srcImages}/icons/**/*.png`,
    dest: {
      css: paths.srcStylesheets,
      image: `${paths.srcImages}/sprites`
    }
  },
  watch: {
    jekyll: [
      '_config.yml',
      '_config.build.yml',
      'stopwords.txt',
      `${paths.src}/_data/**/*.{json,yml,csv}`,
      `${paths.src}/_includes/**/*.{html,xml}`,
      `${paths.src}/_layouts/**/*.{html}`,
      `${paths.src}/_plugins/**/*.{rb}`,
      `${paths.src}/_posts/**/*.{md,markdown}`,
      `${paths.src}/**/*.{html,md,markdown,yml,json,txt,xml}`,
      `${paths.src}/*`
    ],
    images: `${paths.srcImages}/**/*`,
    vectors: `${paths.srcVectors}/**/*.svg`,
    javascripts: `${paths.srcJavascripts}/**/*.{js}`,
    stylesheets: `${paths.srcStylesheets}/**/*.{scss,css}`
  }
};
