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
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: ['babel-preset-react']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
