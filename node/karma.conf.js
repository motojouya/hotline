// Generated on Sun Nov 26 2017 10:17:42 GMT+0000 (UTC)
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/*.js'
    ],
    exclude: [],
    preprocessors: {
      'test/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015'],
          }
        }]
      }
    },
  })
}
