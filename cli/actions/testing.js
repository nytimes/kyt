#!/usr/bin/env node
const shell = require('shelljs');
console.log('hey its me');
shell.exec('sleep 3');
console.log('I just slept for 3!');
shell.exec('sleep 255');
console.log('bye!!');
