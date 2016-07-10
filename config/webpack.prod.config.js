const path = require('path')
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
const webpack = require('webpack');
const fs = require('fs');

module.exports = function(options) {
  return {
    // TODO: figure out what we need todo.
    entry: [
      './src/index.js',
    ],
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
    },
  }
}
