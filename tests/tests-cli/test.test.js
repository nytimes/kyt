import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
    if (shell.test('-d', 'cli-test-test')) {
      shell.rm('-rf', 'cli-test-test');
    }
    shell.mkdir('cli-test-test');
    shell.cd('cli-test-test');
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
});

test.serial('test', t => {
  let output = shell.exec('npm run test');
  t.is(output.code, 0);
  const outputArr = output.stdout.split('\n');
  console.log('ARR', outputArr);
  //t.false(shell.test('-d', 'kyt-test'));
  // t.true(outputArr.includes('Using kyt config at /Users/205605/web-frameworks/wf-kyt/__test__/cli-test-test/kyt.config.js'));
  // t.true(outputArr.includes('🔥  Running Test Command...'));
  // t.true(outputArr.includes('👍  Server webpack configuration compiled'));
  // t.true(outputArr.includes('ℹ️  Compiling...'));
  // t.true(outputArr.includes('👍  Server build successful'));
  // t.true(outputArr.includes('ℹ️  Starting test...'));
});


test.after(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test-test');
});
