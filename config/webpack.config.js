var path = require('path')
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
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
        loaders: [
          'react-hot',
          'babel-loader'
        ],
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
    hot: true
  }
};
