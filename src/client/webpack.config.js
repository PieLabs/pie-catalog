const path = require('path');

module.exports = {
  context: path.join(__dirname),
  entry: './src/entry.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js']
  }
};
