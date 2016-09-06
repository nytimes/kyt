// This module has to be supported by old versions of node, so no ES6
/* eslint-disable no-var, prefer-arrow-callback, prefer-template, no-console */
var minNodeVersion = 6;

// Surface any uncaught errors
process.on('uncaughtException', function (error) {
  console.error('UNHANDLED EXCEPTION', error.stack);
  process.exit();
});

// Make sure that the user has a compatible node version before loading the app.
if (Number(process.versions.node.split('.')[0]) < minNodeVersion) {
  console.error('kyt requires Node v' + minNodeVersion + '+');
  console.info('Need to run multiple versions of node? Check out nvm');
  process.exit();
}

require('./commands');
