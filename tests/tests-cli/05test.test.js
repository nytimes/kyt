import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  shell.cd('cli-test');
});
test.serial('test', t => {
  let output = shell.exec('npm run test');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  t.true(outputArr.includes('🔥  Running Test Command...'));
  t.true(outputArr.includes('👍  Server webpack configuration compiled'));
  t.true(outputArr.includes('ℹ️  Compiling...'));
  t.true(outputArr.includes('👍  Server build successful'));
  t.true(outputArr.includes('ℹ️  Starting test...'));
});
