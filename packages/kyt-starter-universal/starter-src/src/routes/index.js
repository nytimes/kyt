import React from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';
import Home from '../components/Home';
import Tools from '../components/Tools';

// Unfortunately, HMR breaks when we dynamically resolve
// routes so we need to require them here as a workaround.
// https://github.com/gaearon/react-hot-loader/issues/288
if (module.hot) {
  require('../components/Home');    // eslint-disable-line global-require
  require('../components/Tools');   // eslint-disable-line global-require
}

// with guidance from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md
const Status = ({ code, children }) => (
  <Route render={({ staticContext }) => {
    // there is no `staticContext` on the client, so
    // we need to guard against that here
    if (staticContext) {
      staticContext.status = code
    }

    return children
  }}/>
)
const RedirectWithStatus = ({ from, to, status }) => (
  <Status code={status}>
    <Redirect from={from} to={to}/>
  </Status>
)

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
)

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="tools" component={Tools} />
    <RedirectWithStatus
      status={301}
      from="/old7"
      to="/"
    />
    <Route component={NotFound}/>
  </Switch>
);