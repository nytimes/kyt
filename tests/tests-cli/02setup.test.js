import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
    if (shell.test('-d', 'cli-test')) {
      shell.rm('-rf', 'cli-test');
    }
    shell.mkdir('cli-test');
    shell.cd('cli-test');
    shell.cp(pkgJsonPath, 'package.json');
    const output = shell.exec('npm install');
    if (output.code !== 0) {
      console.log(output.stderr);
      process.exit();
    }
});
test.serial('installation', t => {
    t.true(shell.test('-f', 'package.json'));
    t.true(shell.test('-d', 'node_modules'));
});

test.serial('setup', t => {
  const output = shell.exec('node_modules/.bin/kyt setup -r git@github.com:nytm/wf-kyt-starter-test.git');
  t.is(output.code, 0);
  const setupArr = output.stdout.split('\n');
  t.true(setupArr.includes('🔥  Setting up starter-kyt'));
  t.true(setupArr.includes('👍  Added kyt scripts into your package.json scripts'));
  t.true(setupArr.includes('👍  Added new dependencies to package.json'));
  t.true(setupArr.includes('ℹ️  Cleaning node modules and reinstalling. This may take a couple of minutes...'));
  t.true(setupArr.includes('👍  Installed new modules'));
  t.true(setupArr.includes('👍  Copied kyt default ESLint config'));
  t.true(setupArr.includes('👍  Copied default Stylelint config'));
});

test.serial('setup-files', t => {
  t.true(shell.test('-d', 'src'));
  t.true(shell.test('-f', 'kyt.config.js'));
  t.true(shell.test('-f', '.editorconfig'));
  t.true(shell.test('-f', '.eslintrc'));
  t.true(shell.test('-f', '.stylelintrc'));
  t.true(shell.test('-f', 'prototype.js'));
});

test.serial('setup-package-json', t => {
  let userPackageJSON = require('./cli-test/package.json');
  let scripts = userPackageJSON.scripts;
  t.is(scripts.dev, 'kyt dev');
  t.is(scripts.build, 'kyt build');
  t.is(scripts.test, 'kyt test');
  t.is(scripts.lint, 'kyt lint');
  t.is(scripts.proto, 'kyt proto');
  t.is(scripts['kyt:help'], 'kyt --help');
});
