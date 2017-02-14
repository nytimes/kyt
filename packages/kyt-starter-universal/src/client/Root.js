
import React from 'react';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import routes from '../routes'; // eslint-disable-line import/no-named-as-default,import/no-named-as-default-member

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <Router history={browserHistory} routes={routes} />
  );
}

export default Root;
