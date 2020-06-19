# kyt-utils

This package is for utilities shared across these `kyt` packages:

* `kyt`
* `kyt-runtime`

Ensure that Node 10+ is installed:

```js
require('kyt-utils/checkNodeVersion');
```

Get a [map of paths](paths.js) used to configure `kyt`:

```js
const {
  serverSrcPath,
  serverBuildPath,
  clientAssetsFile,
  loadableAssetsFile,
} = require('kyt-utils/paths')();
```

The default export is a `logger` - a wrapper around `console`:

```js
import logger from 'kyt-utils';


logger.log('message');

// outputs 👍  message
logger.task('message');

// outputs ℹ️  message
logger.info('message');

// outputs 🐞  message
logger.debug('message');

// outputs 🙀  message
logger.warn('message');

// outputs:
// ❌  message
logger.error('message');

// outputs:
// 🔥  message
logger.start('message');

// outputs:
// ✅  message
logger.end('message');
```
