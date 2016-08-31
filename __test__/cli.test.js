import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './pkg.json');
    shell.mkdir('cli-test');
    shell.cd('cli-test');
    shell.cp(pkgJsonPath, 'package.json');
    const output = shell.exec('npm install');
    if (output.code !== 0) {
      console.log(output.stderr);
      process.exit();
    }
});
test('installation', t => {
    t.true(shell.test('-f', 'package.json'));
    t.true(shell.test('-d', 'node_modules'));
});

test('setup', t => {
  const output = shell.exec('node_modules/.bin/kyt setup');
  t.is(output.code, 0);
  const setupArr = output.stdout.split('\n');
  t.is(setupArr[0], '🔥  Setting up kyt starter');
});

test('setup-files', t => {
  t.true(shell.test('-d', 'src'));
  t.true(shell.test('-f', 'kyt.config.js'));
  t.true(shell.test('-f', '.editorconfig'));
  t.true(shell.test('-f', '.eslintrc'));
  t.true(shell.test('-f', '.stylelintrc'));
  t.true(shell.test('-f', 'prototype.js'));
});

test('setup-package-json', t => {
  let userPackageJSON = require('./cli-test/package.json');
  console.log(userPackageJSON);
  let scripts = userPackageJSON.scripts;
  t.is(scripts.dev, 'kyt dev');
  t.is(scripts.build, 'kyt build');
  t.is(scripts.test, 'kyt test');
  t.is(scripts.lint, 'kyt lint');
  t.is(scripts.proto, 'kyt proto');
  t.is(scripts['kyt:help'], 'kyt --help');
});

test.after(t => {
  console.log('running after');
    shell.cd('..');
    shell.rm('-rf', 'cli-test');
});
