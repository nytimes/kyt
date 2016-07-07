var path = require('path')
const autoprefixer = require('autoprefixer');
const remify = require('postcss-remify');
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
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      loaders: [
        {
          test: /\.html$/,
          loader: 'file?name=[name].[ext]'
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          exclude: /node_modules/,
          loader: 'url-loader'
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
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]-[local]--[hash:base64:5]',
            'postcss-loader',
            'sass-loader'
          ]
        },
      ],
    },
    postcss: [
      autoprefixer({ browsers: ['last 2 versions'] }),
      remify,
    ],
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
