import test from 'ava';
import shell from 'shelljs';
import path from 'path';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
    if (shell.test('-d', 'cli-test-proto')) {
      shell.rm('-rf', 'cli-test-proto');
    }
    shell.mkdir('cli-test-proto');
    shell.cd('cli-test-proto');
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

test.todo('proto');

test.after(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test-proto');
});
