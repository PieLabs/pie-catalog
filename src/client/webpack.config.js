const path = require('path');
const webpack = require('webpack');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  devtool: 'eval',
  context: path.join(__dirname),
  entry: {
    index: './src/entry.js',
    repo: './src/repo-entry.js',
    org: './src/org-entry.js'
  },
  output: {
    publicPath: '/',
    path: path.join(__dirname, 'public'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].[id].js'
  },
  module: {

    loaders: [
      { test: /\.css$/, use: ['raw-loader'] },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      }
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
