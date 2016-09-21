const kytUserConfig = require('../kyt.user.config');

it('kyt.user.config exports an object', () => {
  expect(kytUserConfig).toEqual({
    debug: false,
  });
});
