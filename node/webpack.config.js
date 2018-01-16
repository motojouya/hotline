const path = require('path')

module.exports = {
  entry: {
    "app/bundle": './building/client/app.js',
    "register/bundle": './building/client/register.js',
    "sw": './building/client/service-worker.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js'
  }
};

