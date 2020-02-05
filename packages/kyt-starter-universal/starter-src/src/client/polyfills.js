// kyt dependency for polyfills, using babel-preset-env.

// Polyfill for node that works with `babel-preset-env` `useBuiltIns` option.
// Cover all standardized ES6 APIs.
import 'core-js/stable';
import 'regenerator-runtime/runtime';
