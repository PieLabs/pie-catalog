const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './entry.js',
  output: {
    path: path.join(__dirname, '../src/element/demo'),
    filename: 'react-w-tap-event.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}