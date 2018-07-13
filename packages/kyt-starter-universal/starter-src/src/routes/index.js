import React, { PropTypes } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '../components/Home';
import Tools from '../components/Tools';

// with guidance from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md
const Status = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      // there is no `staticContext` on the client, so
      // we need to guard against that here
      if (staticContext) {
        staticContext.status = code;
      }

      return children;
    }}
  />
);

const RedirectWithStatus = ({ from, to, status }) => (
  <Status code={status}>
    <Redirect from={from} to={to} />
  </Status>
);

const NotFound = () => (
  <Status code={404}>
    <div>
      <h1>Sorry, can’t find that.</h1>
    </div>
  </Status>
);

// Note: A redirect can be added in this form
// <RedirectWithStatus status={301} from="/old" to="/new" />
const Routes = (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/tools" component={Tools} />
    <Route component={NotFound} />
  </Switch>
);

Status.propTypes = {
  code: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
};

RedirectWithStatus.propTypes = {
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
};

export default Routes;
