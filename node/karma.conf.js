// Generated on Sun Nov 26 2017 10:17:42 GMT+0000 (UTC)
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'src/lib/*.js',
      'test/*.js'
    ],
    exclude: [
      'test/indexedDatabase.js'
    ],
    plugins: [
      'karma-phantomjs-launcher',
      //'karma-chrome-launcher',
      'karma-mocha',
      'karma-chai',
      'karma-webpack',
      //'karma-phantomjs-shim',
      //'karma-sourcemap-loader',
      //'karma-coverage',
      //'karma-mocha-reporter'
    ],
    preprocessors: {
      'test/*.js': ['webpack']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: false,
    //browsers: ['ChromeHeadless'],
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    webpack: {
      //devtool: 'inline-source-map',
      /*module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
          }
        }]
      }*/
    },
  })
}
