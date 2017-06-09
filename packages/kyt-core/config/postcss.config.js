const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [autoprefixer({ browsers: ['last 2 versions', 'ios 8'] })],
};
