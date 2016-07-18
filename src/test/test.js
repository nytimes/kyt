var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');

var Demo = require('../demo.js');

describe('DEMO', () => {
  it('this is a test', () => {
    const wrapper = enzyme.shallow(
      <Demo />);
    wrapper.debug();
    chai.assert.true(true);
  });
});