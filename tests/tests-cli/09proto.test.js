import test from 'ava';
import shell from 'shelljs';
import kill from '../../utils/psKill';

test.before(t => {
  shell.cd('cli-test');
});
test.cb('proto', t => {
  const child = shell.exec('npm run proto', (code, stdout, stderr) => {
    t.end();
  });
  let stillAlive = true;
  child.stdout.on('data', (data) => {
    if (data.includes('webpack: bundle is now VALID.') && stillAlive) {
      stillAlive = false;
      shell.exec('sleep 2');
      const output = shell.exec('curl -I localhost:3102/prototype');
      t.true(output.includes('200'));
      kill(child.pid);
    }
  });
});

test.after.always(t => {
    shell.cd('..');
    shell.rm('-rf', 'cli-test');
});
