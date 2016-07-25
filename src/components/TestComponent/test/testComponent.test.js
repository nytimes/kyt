import test from 'ava';
var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');
import TestComponent from '../TestComponent';
test('one', t => {
    const wrapper = enzyme.shallow(
      <TestComponent hello="hi"/>);
    t.pass(chai.assert.equals(wrapper.props.hello, "hi"));
});
