import React from 'react';
import { hydrate } from 'react-dom';
import { preloadDynamicImports } from 'kyt-runtime/client';
import Root from './Root';

preloadDynamicImports().then(() => {
  hydrate(<Root />, document.querySelector('#root'));
});

// enable Hot Module Replacement (HMR) via Webpack polling
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept();
}
