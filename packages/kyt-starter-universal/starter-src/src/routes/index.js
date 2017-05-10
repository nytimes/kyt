
import React from 'react';
import { Route } from 'react-router-dom';
import App from '../components/App';

//TODO: Merge with Root.js?
// We use `getComponent` to dynamically load routes.
// https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md
const routes = (
  <Route path="/" component={App} />
);

export default routes;
