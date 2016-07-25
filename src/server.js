import webpack from 'webpack';
import webpackDev from 'webpack-dev-middleware';
import webpackHot from 'webpack-hot-middleware';
import kyt from 'kyt';
import express from 'express';
import path from 'path';

const configs = kyt.getConfiguration();
const app = express();

app.use(webpackDev(configs.webpackCompiler, {
  headers: {'Access-Control-Allow-Origin': '*'},
  noInfo: true,
  publicPath: configs.webpackConfig.output.publicPath
}));

app.get('/', function(req, res) {
  const p = path.resolve(__dirname + '/index.html');
  res.sendFile(p);
});

app.use(webpackHot(configs.webpackCompiler));

app.listen(configs.port);

