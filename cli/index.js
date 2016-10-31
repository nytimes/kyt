#!/usr/bin/env node

// This module has to be supported by old versions of node, so no ES6
/* eslint-disable no-var, prefer-arrow-callback, prefer-template, no-console */
var minNodeVersions = 6;

// Make sure that the user has a compatible node version before loading the app.
if (Number(process.versions.node.split('.')[0]) < minNodeVersions) {
  console.error('kyt requires Node v' + minNodeVersions + '+');
  console.info('Need to run multiple versions of node? Check out nvm');
  process.exit(1);
}

require('./commands');
