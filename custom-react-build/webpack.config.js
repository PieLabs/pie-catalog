const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname),
  entry: './entry.js',
  output: {
    path: path.join(__dirname, '../lib/element/demo'),
    filename: 'react-w-tap-event.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
}