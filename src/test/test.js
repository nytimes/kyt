
import React from 'react';
import chai from 'chai';
import enzyme from 'enzyme';
import Demo from '../demo.js';

describe('DEMO', () => {
  it('this is a test', () => {
    const wrapper = enzyme.shallow(
      <Demo />);
    // eslint-disable-next-line
    console.log(wrapper.debug());
    chai.assert.isTrue(true);
  });
});
