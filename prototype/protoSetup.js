
// TOODOO: Not sure what to do here since
// we no longer depend on React

/* eslint-disable */

const reactDom = require('react-dom');
const react = require('react');

// Render Component in the DOM
module.exports = (component) => {
  const rootEl = document.getElementById('root');
  reactDom.render(react.createElement(component), rootEl)
};
