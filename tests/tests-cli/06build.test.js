import test from 'ava';
import shell from 'shelljs';

test.before(t => {
  shell.cd('cli-test');
});

test.serial('build', t => {
  let output = shell.exec('npm run build');
  t.is(output.code, 0);
  t.true(shell.test('-d', 'build'));
  t.true(shell.test('-d', 'build/server'));
  t.true(shell.test('-f', 'build/publicAssets.json'));
  t.true(shell.test('-d', 'build/public'));
});
