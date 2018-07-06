import 'babel-polyfill';
import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import ClientApp from '../components/App';
import template from './template';

const clientAssets = require(KYT.ASSETS_MANIFEST); // eslint-disable-line import/no-dynamic-require
const port = parseInt(KYT.SERVER_PORT, 10);
const app = express();

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

// Setup server side routing.
app.get('*', (request, response) => {
  const context = {};

  // See docs for details
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={request.url} context={context}>
      <ClientApp />
    </StaticRouter>
  );

  if (context.status) {
    response.status(context.status);
  }

  if (context.url) {
    response.writeHead(301, {
      Location: context.url,
    });

    response.end();
    return;
  }

  response.write(
    template({
      root: html,
      manifestJSBundle: clientAssets['manifest.js'],
      mainJSBundle: clientAssets['main.js'],
      vendorJSBundle: clientAssets['vendor.js'],
      mainCSSBundle: clientAssets['main.css'],
    })
  );

  response.end();
});

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`); // eslint-disable-line no-console
});
