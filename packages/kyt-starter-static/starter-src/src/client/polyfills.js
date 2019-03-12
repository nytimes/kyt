// kyt dependency for polyfills, using babel-preset-env.

// General polyfill for es6+ features that works with `babel-preset-env` `useBuiltIns` option.
import '@babel/polyfill';

// We have to manually polyfill `.forEach` until preset-env polyfills es5 features.
import 'core-js/modules/es6.array.for-each';
