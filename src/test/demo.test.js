import test from 'ava';
var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');
import Demo from '../demo.js';
test('one', t => {
    const wrapper = enzyme.shallow(
      <Demo />);
    t.pass(chai.assert.isTrue(wrapper.hasClass('demo')));
});
