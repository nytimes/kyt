const presetTypescript = require('@babel/preset-typescript');
const presetKyt = require('..');

jest.mock('babel-preset-kyt-react', () => 'babel-preset-kyt-react');
jest.mock('@babel/preset-typescript', () => '@babel/preset-typescript');

describe('babel-preset-kyt', () => {
  /**
   * Note that unlike plugins, the presets are applied in an order of last to first
   * (https://babeljs.io/docs/en/presets/#preset-ordering), so please make sure
   * `@babel/preset-typescript` is the last preset in this array.
   */
  it('includes @babel/preset-typescript as the last preset in the array', () => {
    const config = presetKyt({});

    expect(config.presets[config.presets.length - 1]).toBe(presetTypescript);
  });
});
