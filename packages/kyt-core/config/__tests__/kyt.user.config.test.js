const kytUserConfig = require('../user/kyt.config');

it('kyt.user.config exports an object', () => {
  expect(kytUserConfig).toEqual({
    debug: false,
  });
});
