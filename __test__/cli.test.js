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
  t.true(shell.test('-d', 'src'));
  t.true(shell.test('-f', 'kyt.config.js'));
  //t.true(shell.test('-f', '.gitignore'));
  t.true(shell.test('-f', '.editorconfig'));
  t.true(shell.test('-f', '.eslintrc'));
  t.true(shell.test('-f', '.stylelintrc'));


});

// test.after(t => {
//   console.log('running after');
//     shell.cd('..');
//     shell.rm('-rf', 'cli-test');
// });
