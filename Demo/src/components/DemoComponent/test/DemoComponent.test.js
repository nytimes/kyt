
import test from 'ava';
var React= require('react');
var chai = require('chai');
var enzyme= require('enzyme');
import DemoComponent from '../DemoComponent';
/*
 * This testing environment uses:
 * ava : https://github.com/avajs/ava
 * chai: http://chaijs.com/
 * enzyme: https://github.com/airbnb/enzyme
 */
test('Tests that true is true.', t => {
    const wrapper = enzyme.shallow(
      <DemoComponent/>);
    t.pass(chai.assert.isTrue(true));
});
