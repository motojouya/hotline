const path = require('path')

module.exports = {
  entry: {
    "app": './building/client/app.js',
    "register": './building/client/register.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]/bundle.js'
  }
};

