
const path = require('path');

module.exports = () => ({
  // TODO: figure out what we need todo.
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
});
