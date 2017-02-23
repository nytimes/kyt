const path = require('path');

module.exports = {
  modifyJestConfig: (config) => {
    config.testMatch = '**/?(*.)test.js';
    return config;
  }
};
