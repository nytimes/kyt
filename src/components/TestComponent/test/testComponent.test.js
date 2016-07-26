import test from 'ava';
var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');
import TestComponent from '../TestComponent';
/*
 * This testing environment uses:
 * ava : https://github.com/avajs/ava
 * chai: http://chaijs.com/
 * enzyme: https://github.com/airbnb/enzyme
 */

test('one', t => {
    const wrapper = enzyme.shallow(
      <TestComponent hello="hi"/>);
    t.pass(chai.assert.isTrue(true));
});
