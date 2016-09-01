import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './pkg.json');
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
test('installation', t => {
    t.true(shell.test('-f', 'package.json'));
    t.true(shell.test('-d', 'node_modules'));
});

test('setup', t => {
  const output = shell.exec('node_modules/.bin/kyt setup');
  t.is(output.code, 0);
  const setupArr = output.stdout.split('\n');
  t.true(setupArr.includes('🔥  Setting up kyt starter'));
  t.true(setupArr.includes('👍  Added kyt scripts into your package.json scripts'));
  t.true(setupArr.includes('👍  Added new dependencies to package.json'));
  t.true(setupArr.includes('ℹ️  Cleaning node modules and reinstalling. This may take a couple of minutes...'));
  t.true(setupArr.includes('👍  Installed new modules'));
  t.true(setupArr.includes('👍  Copied kyt default ESLint config'));
  t.true(setupArr.includes('👍  Copied default Stylelint config'));
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
  let scripts = userPackageJSON.scripts;
  t.is(scripts.dev, 'kyt dev');
  t.is(scripts.build, 'kyt build');
  t.is(scripts.test, 'kyt test');
  t.is(scripts.lint, 'kyt lint');
  t.is(scripts.proto, 'kyt proto');
  t.is(scripts['kyt:help'], 'kyt --help');
});


test('build', t => {
  let output = shell.exec('npm run build');
  t.is(output.code, 0);
  t.true(shell.test('-d', 'build'));
  t.true(shell.test('-d', 'build/server'));
  t.true(shell.test('-f', 'build/publicAssets.json'));
  t.true(shell.test('-d', 'build/public'));
});

test('test', t=> {
  let output = shell.exec('npm run test');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  console.log('ARR', outputArr);
  //t.false(shell.test('-d', 'kyt-test'));
  t.true(outputArr.includes('Using kyt config at /Users/205605/web-frameworks/wf-kyt/__test__/cli-test/kyt.config.js'));
  t.true(outputArr.includes('🔥  Running Test Command...'));
  t.true(outputArr.includes('👍  Server webpack configuration compiled'));
  t.true(outputArr.includes('ℹ️  Compiling...'));
  t.true(outputArr.includes('👍  Server build successful'));
  t.true(outputArr.includes('ℹ️  Starting test...'));
});

test('lint', t => {
  let output = shell.exec('npm run lint');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  t.false(outputArr.includes('You do not have an .eslintrc file'));
});

test('lint-style', t => {
  let output = shell.exec('node_modules/.bin/kyt lint-style');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  // t.true(outputArr.includes('Your styles look good! ✨\n'));
});

test.after(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test');
});
