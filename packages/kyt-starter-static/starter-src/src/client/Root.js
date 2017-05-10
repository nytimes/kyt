
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import routes from '../routes';

// We need a Root component for React Hot Loading.
function Root() {
  return (
    <BrowserRouter children={routes} />
  );
}

export default Root;
