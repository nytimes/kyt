var path = require('path')
module.exports = function(port) {
  return {
    debug: true,
    entry: [
      "./src/index.js",
      'webpack-dev-server/client?http://localhost:' + port,
      "webpack/hot/dev-server"
    ],
    output: {
      path: path.join(__dirname, './dist'),
      filename: 'bundle.js',
      publicPath: 'http://localhost:' + port + '/',
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]'
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {presets: ['react-hmre']},
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loaders: ['style', 'css?modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]']
        },
      ],
    },
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    devServer: {
      contentBase: './src',
      hot: true,
      port: port,
      host: 'localhost',
      watchOptions: {
        aggregateTimeout: 300
      },
      stats: 'errors-only'
    }
  }
}
