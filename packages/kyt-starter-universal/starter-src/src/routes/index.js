import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import App from '../components/App';

// Webpack supports `import()` by auto-chunking assets.
// Check out the following for more:
// https://webpack.js.org/guides/code-splitting/

const importHome = (nextState, cb) => {
  import(/* webpackChunkName: "home" */ '../components/Home')
    .then(module => cb(null, module.default))
    .catch(e => {
      throw e;
    });
};

const importTools = (nextState, cb) => {
  import(/* webpackChunkName: "tools" */ '../components/Tools')
    .then(module => cb(null, module.default))
    .catch(e => {
      throw e;
    });
};

// We use `getComponent` to dynamically load routes.
// https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path="/" component={App}>
    <IndexRoute getComponent={importHome} />
    <Route path="tools" getComponent={importTools} />
  </Route>
);

export default routes;
