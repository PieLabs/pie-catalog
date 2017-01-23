const path = require('path');
const webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  context: path.join(__dirname),
  entry: './src/entry.js',
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: 'app.js',
    chunkFilename: '[id].app.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: ['raw-loader'] }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
