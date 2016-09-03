import test from 'ava';
import shell from 'shelljs';
import path from 'path';
import kill from '../../utils/psKill';

test.before(t => {
  const pkgJsonPath = path.join(__dirname, './../pkg.json');
    if (shell.test('-d', 'cli-test-dev')) {
      shell.rm('-rf', 'cli-test-dev');
    }
    shell.mkdir('cli-test-dev');
    shell.cd('cli-test-dev');
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

test.cb('dev', t => {
  const child = shell.exec('npm run dev', (code, stdout, stderr) => {
    t.end();
  });
  child.stdout.on('data', (data) => {
    if (data.includes('✅  Development started')) {
      shell.exec('sleep 2');
      const output = shell.exec('curl -I localhost:3100');
      t.true(output.includes('200'));
      kill(child.pid);
    }
  });
});

test.cb('change file and watch for reload', t => {
  const child = shell.exec('npm run dev', (code, stdout, stderr) => {
    t.end();
  });
  let stillAlive = true;
  child.stdout.on('data', (data) => {
    if (data.includes('✅  Development started')) {
      shell.exec('sleep 2');
      const output = shell.exec('curl -I localhost:3100');
      t.true(output.includes('200'));
      shell.exec('touch -am ./src/components/HelloWorld/index.js');
    }

    if (data.includes('👍  Development server restarted') && stillAlive) {
      stillAlive = false;
      shell.exec('sleep 3');
      const output = shell.exec('curl -I localhost:3100');
      t.true(output.includes('200'));
      kill(child.pid);
    }
  });
});

test.after.always(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test-dev');
});
