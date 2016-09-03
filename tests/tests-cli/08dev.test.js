import test from 'ava';
import shell from 'shelljs';
import kill from '../../utils/psKill';

test.before(t => {
  shell.cd('cli-test');
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
