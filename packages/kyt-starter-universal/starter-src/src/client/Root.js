
import React from 'react';
import { BrowserRouter as Router } from 'react-router';
import routes from '../routes';

//testing

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <Router routes={routes} />
  );
}

export default Root;
