
const merge = require('webpack-merge');

module.exports = merge.smart({}, {
  module: {
    loaders: [
      {
        test: /\.(scss|css)$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
});
