
import 'source-map-support/register';
import fs from 'fs';
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

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.SERVER_PORT });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, response) {
      const history = createMemoryHistory(request.originalUrl);

      match({ routes, history }, (error, redirectLocation, renderProps) => {
        if (error) {
          // response.status(500).send(error.message);
        } else if (redirectLocation) {
          // response.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
        } else if (renderProps) {
          response(template({
            root: renderToString(<RouterContext {...renderProps} />),
            css: new cleancss().minify(jss.sheets.toString()).styles,
            jsBundle: clientAssets.main.js
          }));
        } else {
          // response.status(404).send('Not found');
        }
      });
    }
});

server.start((err) => {
  if (err) throw err;
  console.log('Server running at:', server.info.uri);
});
