/*
 * Demo client index.js file
 * kyt expects every app to have this entry point.
 *
**/
import React from 'react';
import { render } from 'react-dom';
import DemoComponent from '../components/DemoComponent/DemoComponent';

const root = document.querySelector('#root');

const mount = () => {
  render(<DemoComponent />, root);
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  // Rerender after any changes to the following.
  module.hot.accept('./index.js');
}

mount();
