const { pass, fail } = require('create-jest-runner');
const stylelint = require('stylelint');
const configOverrides = require('./configOverrides');

const configPath = require.resolve('./.stylelintrc');

module.exports = ({ testPath /* , config, globalConfig */ }) => {
  const start = new Date();

  return stylelint
    .lint({
      configFile: configPath,
      files: testPath,
      formatter: 'string',
      fix: configOverrides.getFix(),
    })
    .then(data => {
      if (data.errored) {
        return fail({
          start,
          end: new Date(),
          test: {
            path: testPath,
            errorMessage: data.output,
          },
        });
      }

      return pass({
        start,
        end: new Date(),
        test: { path: testPath },
      });
    })
    .catch(err => {
      throw err;
    });
};
