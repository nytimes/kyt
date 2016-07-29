'use strict';
/**
 * Exports the useSheet HOC and Jss for use in your app.
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSheet = exports.jss = undefined;

var _jss = require('jss');

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

var _jssVendorPrefixer = require('jss-vendor-prefixer');

var _jssVendorPrefixer2 = _interopRequireDefault(_jssVendorPrefixer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jss = exports.jss = (0, _jss.create)();
var useSheet = exports.useSheet = (0, _reactJss2.default)(jss);

jss.use((0, _jssVendorPrefixer2.default)());
