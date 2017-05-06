import React from 'react';
import { BrowserRouter } from 'react-router';
import routes from '../routes';

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <BrowserRouter routes={routes} />
  );
}

export default Root;
