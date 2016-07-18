const merge = require('webpack-merge');
//const baseConfig = require('./webpack.base.config');

module.exports = merge.smart({}, {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
});