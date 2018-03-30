const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  hasServer: false,
  
  modifyWebpackConfig: (config, options) => {
    if (options.type === 'client') {

    }

    return config;
  },
};
