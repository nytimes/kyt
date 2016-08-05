'use strict';
var path = require('path');
var reactDom = require('react-dom');
var react = require('react');

// Render Component in the DOM
module.exports = function(component) {
  var rootEl = document.getElementById('root');
  reactDom.render(react.createElement(component), rootEl)
}
