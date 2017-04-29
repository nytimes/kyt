
import React from 'react';
import Router from 'react-router/lib/BrowserRouter';
import routes from '../routes';

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <Router routes={routes} />
  );
}

export default Root;
