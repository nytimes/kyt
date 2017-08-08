const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  reactHotLoader: true,
  debug: false,
  hasServer: false,
  modifyWebpackConfig: (config, options) => {
    if (options.type === 'client') {
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: 'src/index.ejs',
          // Sort the chunks so that the scripts are added in the correct order.
          chunksSortMode: (chunk1, chunk2) => {
            const orders = ['manifest', 'vendor', 'main'];
            const order1 = orders.indexOf(chunk1.names[0]);
            const order2 = orders.indexOf(chunk2.names[0]);
            return order1 - order2;
          },
        })
      );
    }

    return config;
  },
};
