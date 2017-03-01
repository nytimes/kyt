
// This is your prototyping file.
// It is the entry for the webpack dev server
// when you run the kyt proto command.
import React from 'react';
import ReactDom from 'react-dom';

// Import your component here for easy development
import Home from './src/components/Home';

// Attach the component to the root.
const rootEl = document.getElementById('root');
ReactDom.render(
  <Home />,
  rootEl
);
