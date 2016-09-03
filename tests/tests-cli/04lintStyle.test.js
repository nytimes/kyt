import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  shell.cd('cli-test');
});

test.serial('lint-style', t => {
  console.log('lintstyle');
  let output = shell.exec('node_modules/.bin/kyt lint-style');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  t.true(outputArr.includes('✅  Your styles look good! ✨'));
});
