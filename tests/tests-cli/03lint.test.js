import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  shell.cd('cli-test');
});

test.serial('lint', t => {
  let output = shell.exec('npm run lint');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  t.false(outputArr.includes('You do not have an .eslintrc file'));
});
