const path = require('path')

module.exports = {
  entry: {
    "app": './building/client/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]/bundle.js'
  }
};

