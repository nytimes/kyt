const { createJestRunner } = require('create-jest-runner');

const runPath = require.resolve('./run');

module.exports = createJestRunner(runPath);
