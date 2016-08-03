
import 'source-map-support/register';
import express from 'express';
import fs from 'fs';
import compression from 'compression';
import React from 'react';
import { renderToString } from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';
import template from './template';
import routes from '../routes';
import cleancss from 'clean-css';
import jss from 'jss';
const clientAssets = require(process.env.ASSETS_PATH);

const app = express();
app.disable('x-powered-by');
app.use(compression());

app.use(process.env.PUBLIC_PATH, express.static(process.env.CLIENT_BUILD_PATH));

app.get('*', (request, response, next) => {
  const history = createMemoryHistory(request.originalUrl);

  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      response.status(200).send(template({
        root: renderToString(<RouterContext {...renderProps} />),
        css: new cleancss().minify(jss.sheets.toString()).styles,
        jsBundle: clientAssets.main.js
      }));
    } else {
      response.status(404).send('Not found');
    }
  });
});

app.listen(parseInt(process.env.SERVER_PORT, 10));
