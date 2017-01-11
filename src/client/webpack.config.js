const path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: './src/entry.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ['raw-loader'] }
    ]
  },
  resolve: {
    extensions: ['.js']
  }
};
