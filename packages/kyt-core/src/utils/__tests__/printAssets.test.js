const assets = [
  {
    name: 'main-1087ba4603e1150cbc80.js',
    size: 664552,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true,
  },
  {
    name: 'main-1087ba4603e1150cbc80.js.map',
    size: 5094906,
    chunks: [0],
    chunkNames: ['main'],
    emitted: true,
  },
];

const fs = {
  readFileSync: jest.fn(),
};

const gzSize = {
  sync: jest.fn().mockReturnValueOnce(200000).mockReturnValueOnce(60000),
};

jest.setMock('fs', fs);
jest.setMock('gzip-size', gzSize);
jest.mock('kyt-utils/logger');

describe('printAssets', () => {
  const logger = require('kyt-utils/logger');
  require('../printAssets')(
    {
      toJson: () => ({ assets }),
    },
    { output: { path: '' } }
  );

  it('should print asset stats', () => {
    expect(logger.log).toHaveBeenCalledWith(
      '    664.55 kB    (200 kB gzip)    build/public/main-1087ba4603e1150cbc80.js'
    );
  });
});
