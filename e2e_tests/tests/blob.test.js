
describe('blob', () => {
  const path = require('path');
  const shell = require('shelljs');

  it('runs', () => {
    expect(true).toBe(true);
  });

it("works?", () => {
  console.log(1);
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
  console.log(2);
  const shell = require.requireActual('shelljs');
  console.log(3);
  console.log(shell);
  console.log(4);
  console.log(shell.test('-d', 'cli-test'));
  console.log(5);
    if (shell.test('-d', 'cli-test')) {
      shell.rm('-rf', 'cli-test');
    }
    shell.mkdir('cli-test');
    shell.cd('cli-test');
    shell.cp(pkgJsonPath, 'package.json');
    // const output = shell.exec('npm install');
    // if (output.code !== 0) {
    //   console.log(output.stderr);
    //   process.exit();
    // }
    //
     assert.equal(shell.test('-f', 'package.json')).toBe(true);
    // expect(shell.test('-d', 'node_modules')).toBe(true);
});

// it('setup', t => {
//   const output = shell.exec('node_modules/.bin/kyt setup -r git@github.com:nytm/wf-kyt-starter-test.git');
//   t.is(output.code, 0);
//   const setupArr = output.stdout.split('\n');
//   t.true(setupArr.includes('🔥  Setting up starter-kyt'));
//   t.true(setupArr.includes('👍  Added kyt scripts into your package.json scripts'));
//   t.true(setupArr.includes('👍  Added new dependencies to package.json'));
//   t.true(setupArr.includes('ℹ️  Cleaning node modules and reinstalling. This may take a couple of minutes...'));
//   t.true(setupArr.includes('👍  Installed new modules'));
//   t.true(setupArr.includes('👍  Copied kyt default ESLint config'));
//   t.true(setupArr.includes('👍  Copied default Stylelint config'));
// });
//
// it('setup-files', t => {
//   t.true(shell.test('-d', 'src'));
//   t.true(shell.test('-f', 'kyt.config.js'));
//   t.true(shell.test('-f', '.editorconfig'));
//   t.true(shell.test('-f', '.eslintrc'));
//   t.true(shell.test('-f', '.stylelintrc'));
//   t.true(shell.test('-f', 'prototype.js'));
// });
//
// it('setup-package-json', t => {
//   let userPackageJSON = require('./cli-test/package.json');
//   let scripts = userPackageJSON.scripts;
//   t.is(scripts.dev, 'kyt dev');
//   t.is(scripts.build, 'kyt build');
//   t.is(scripts.test, 'kyt test');
//   t.is(scripts.lint, 'kyt lint');
//   t.is(scripts['lint-style'], 'kyt lint-style');
//   t.is(scripts.proto, 'kyt proto');
//   t.is(scripts['kyt:help'], 'kyt --help');
// });

});
