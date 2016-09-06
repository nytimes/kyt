// This module has to be supported by old versions of node,
// it can't have any ES6 (arrow functions, const's etc)
var minNodeVersion = 6;

// Surface any uncaught errors
process.on('uncaughtException', function(error) {
  console.error('UNHANDLED EXCEPTION', error.stack);
  process.exit();
});

// Make sure that the user has a
// ES6 compatible node version before loading the app.
if (Number(process.versions.node.split('.')[0]) < minNodeVersion) {
  console.error('kyt requires Node v' + minNodeVersion + '+');
  console.info('Need to run multiple versions of node? Check out nvm');
  process.exit();
}

require('./commands');
