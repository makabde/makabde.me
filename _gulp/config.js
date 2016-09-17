'use strict';

const paths = {
  /* Sources */
  src: 'src',
  srcImages: 'src/_images',
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

module.exports = {
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
    src: [ paths.buildDevelopmentAssets ]
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
    options: {
      precss: {},
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
  scssLint: {
    options: {
      config: '.scss-lint.yml',
      bundleExec: true
    }
  },
  eslint: {
    options: {
      configFile: '.eslintrc.js'
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
    javascripts: `${paths.srcJavascripts}/**/*.{js}`,
    stylesheets: `${paths.srcStylesheets}/**/*.{scss,css}`
  }
};
