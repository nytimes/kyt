
// Surface any uncaught errors
process.on('uncaughtException', (error) => {
  console.error('UNHANDLED EXCEPTION', error.stack);
  process.exit();
});

// Make sure that the user has a ES6 compatible node
// version before loading the app or SyntaxError's
// will be thrown.
require('./../utils/exitIfOldNodeVersion')();

require('./commands');
