import React from 'react';
import { hydrate } from 'react-dom';
import preloadDynamicImports from 'kyt-runtime/client';
import Root from './Root';

preloadDynamicImports().then(() => {
  hydrate(<Root />, document.querySelector('#root'));
});
