# kyt-runtime

This package is meant me to be paired with [`kyt@1.0.0+ (non-beta)`](https://www.npmjs.com/package/kyt).

## Installation

```sh
$ yarn add kyt-runtime
$ yarn add --dev kyt

// or

$ npm i --save-exact kyt-runtime
$ npm i --save-dev --save-exact kyt
```

## `kyt-runtime/dynamic`

`dynamic` is a port of the [same functionality from Next.js](https://nextjs.org/docs/advanced-features/dynamic-import) - both Next and `kyt`'s implementations are simply Babel/Webpack plugins that wrap [React Loadable](https://github.com/jamiebuilds/react-loadable).

`dynamic` allows you to code-split modules, while also using them as if they were loaded synchronously. This functionality exists in `React.lazy`, but React's implementation only works on the client/browser. `dynamic` works isomorphically - on the client AND during SSR. This was a huge sticking point when the NYT was trying to upgrade from React Router v3, which exposed an isomorphic/asynchronous `getComponent` prop on `<Route>`, to RR v4, which did not.

**In v3:**

```js
const Router = () => (
  <StaticRouter>
    <Route getComponent={() => import(/* webpackChunkName: "foo" */ './Foo')} />
    <Route getComponent={() => import(/* webpackChunkName: "bar" */ './Bar')} />
    <Route getComponent={() => import(/* webpackChunkName: "biz" */ './Biz')} />
  </StaticRouter>
);
```

**In v4 with `dynamic`:**

```js
import dynamic from 'kyt-runtime/dynamic';

// component will be lazy-loaded on first render
const Foo = dynamic(() => import(/* webpackChunkName: "foo" */ './Foo'));
const Bar = dynamic(() => import(/* webpackChunkName: "bar" */ './Bar'));
const Biz = dynamic(() => import(/* webpackChunkName: "biz" */ './Biz'));

// Foo is not actually imported yet
const Router = () => (
  <StaticRouter>
    <Route component={Foo} />
    <Route component={Bar} />
    <Route component={Biz} />
  </StaticRouter>
);
```

### Setup

In your Babel config:

```js
module.exports = {
  plugins: ['kyt-runtime/babel'],
};
```

Note below, both client and server have a `preloadDynamicImports()` export.

#### Client

In `src/client/index.js`:

```js
import React from 'react';
import { hydrate } from 'react-dom';
import { preloadDynamicImports } from 'kyt-runtime/client';
// Whatever React component is at the root of your application
import Root from './Root';

// change this to whatever ID matches the element in your HTML
const rootNode = document.querySelector('#root');

preloadDynamicImports().then(() => {
  hydrate(<Root />, rootNode);
});

// enable Hot Module Replacement (HMR) via Webpack polling
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept();
}
```

#### Server

If you are using `kyt` to build your application, you do not need to configure anything for Webpack, it will happen automatically. The Webpack plugins generate manifest files during the client builds that are used by `getBundles` from `kyt-runtime/server` to dynamically output the paths to compiled JS bundles.

In `src/server/index.js`:

```js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { preloadDynamicImports, DynamicImports, getBundles } from 'kyt-runtime/server';
import App from '../components/App';
import template from './template';

const port = parseInt(KYT.SERVER_PORT, 10);
const app = express();

app.get('*', (req, res) => {
  const modules = [];

  const html = renderToString(
    <DynamicImports report={moduleName => modules.push(moduleName)}>
      <App />
    </DynamicImports>
  );

  res.status(200).send(
    template({
      html,
      bundles: getBundles({ modules }),
    })
  );
});

preloadDynamicImports().then(() => {
  app.listen(port, () => {
    console.log(`✅  server started on port: ${port}`);
  });
});
```

In `src/server/template.js` (or whatever you are using to output HTML):

```js
const getDeferScript = src => `<script defer src="${src}"></script>`;

export default ({ html, bundles }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Example</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <div id="root">${html}</div>
    ${bundles.runtimeBundle ? getDeferScript(bundles.runtimeBundle) : ''}
    ${bundles.vendorBundle ? getDeferScript(bundles.vendorBundle) : ''}
    ${bundles.scripts.map(getDeferScript).join('\n')}
    ${bundles.entryBundle ? getDeferScript(bundles.entryBundle) : ''}
  </body>
</html>
`;
```
