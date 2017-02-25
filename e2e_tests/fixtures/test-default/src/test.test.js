
describe('test', () => {
  it('should pass', () => {
    expect(process.env.BABEL_ENV).toBe('test');
  });
});
