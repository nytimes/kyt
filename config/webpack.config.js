var path = require('path')
module.exports = {
  debug: true,
  entry: [
    "./src/index.js",
    'webpack-dev-server/client?http://0.0.0.0:1337',
    "webpack/hot/dev-server"
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:1337/',
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
    port: 1337,
    host: 'localhost',
    watchOptions: {
      aggregateTimeout: 300
    },
    stats: 'errors-only'
  }
};
