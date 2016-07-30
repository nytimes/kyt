'use strict';
var path = require('path');
var _reactHotLoader = require('react-hot-loader');
var _reactDom = require('react-dom');
var _reactDom2 = _interopRequireDefault(_reactDom);
var _react = require('react');
var _react2 = _interopRequireDefault(_react);
// INTEROP FUNCTION
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = function(component, props) {
var _TestComponent = component;
var _TestComponent2 = _interopRequireDefault(_TestComponent);
var rootEl = document.getElementById('root');
_reactDom2.default.render(_react2.default.createElement(
  _reactHotLoader.AppContainer,
  null,
  _react2.default.createElement(_TestComponent2.default, props)
), rootEl);
}; // end proto setup function
