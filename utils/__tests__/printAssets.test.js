const assets = [{ name: 'main-1087ba4603e1150cbc80.js',
    size: 664552,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true },
  { name: 'main-9b8998c0b9922c283729.css',
    size: 173256,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true },
  { name: 'main-1087ba4603e1150cbc80.js.map',
    size: 5094906,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true },
  { name: 'main-9b8998c0b9922c283729.css.map',
    size: 81927,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true }];

jest.mock('../../cli/logger');

describe('printAssets', () => {
  const logger = require('../../cli/logger');
  const printAssets = require('../printAssets')({
    toJson: () => ({ assets }),
  });

  it('should print asset stats', () => {
    expect(logger.log).toBeCalledWith('    648.98 KB    build/public/assets/main-1087ba4603e1150cbc80.js');
    expect(logger.log).toBeCalledWith('    169.2 KB     build/public/assets/main-9b8998c0b9922c283729.css');
  });
});
