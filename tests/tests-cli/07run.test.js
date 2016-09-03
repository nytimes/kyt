import test from 'ava';
import shell from 'shelljs';
import kill from '../../utils/psKill';

test.before(t => {
  shell.cd('cli-test');
});

test.cb('run', t => {
  shell.exec('npm run build');
  const child = shell.exec('npm run run', (code, stdout, stderr) => {
    t.end();
  });
  child.stdout.on('data', (data) => {
    if (data.includes('Server running')) {
      shell.exec('sleep 3');
      const output = shell.exec('curl -I localhost:3100');
      t.true(output.includes('200'));
      kill(child.pid);
    }
  });
});
