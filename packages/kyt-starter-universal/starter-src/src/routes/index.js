import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../components/Home';
import Tools from '../components/Tools';

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="tools" component={Tools} />
  </Switch>
);
