import test from 'ava';
import shell from 'shelljs';
import kill from '../../utils/psKill';
shell.config.silent = true;
test.cb('run', t => {
  const child = shell.exec('node ./../../cli/actions/testing.js', (code, stdout, stderr) => {
    console.log('callback', code);
    t.end();
  });
  child.stdout.on('data', function(data) {
    console.log('sockett time');
    console.log(data);
    if (data.includes('3')) {
      console.log('killing the child');
      console.log(child.pid);
      kill(child.pid);

    }
  });
});
