var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');

import Demo from '../demo.js';

describe('DEMO', () => {
  it('this is a test', () => {
    const wrapper = enzyme.shallow(
      <Demo />);
    console.log(wrapper.debug());
    chai.assert.isTrue(true);
  });
});