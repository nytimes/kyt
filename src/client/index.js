
import React from 'react';
import { render } from 'react-dom';
import Router from 'react-router/lib/Router';
import browserHistory from 'react-router/lib/browserHistory';
import routes from '../routes';

const root = document.querySelector('#root');

const mount = () => {
  render(<Router history={browserHistory} routes={routes} />, root);
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  // Rerender after any changes to the following.
  module.hot.accept('./index.js');
  module.hot.accept('../routes', mount);
}

mount();
