import React from 'react';
import { shallow, mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';
import { DynamicImports } from 'kyt-runtime/server';
import App, { Home, Tools } from '.';

it('Test example', () => {
  const wrapper = shallow(<App>test</App>);

  expect(wrapper.is('div')).toBeTruthy();
});

it('Test home route', async () => {
  await Home.preload();
  const modules = [];
  const wrapper = mount(
    <DynamicImports report={module => modules.push(module)}>
      <StaticRouter location="/" context={{}}>
        <App />
      </StaticRouter>
    </DynamicImports>
  );

  expect(wrapper).toMatchSnapshot();
  expect(modules).toMatchSnapshot();
});

it('Test tools route', async () => {
  await Tools.preload();
  const modules = [];
  const wrapper = mount(
    <DynamicImports report={module => modules.push(module)}>
      <StaticRouter location="/tools" context={{}}>
        <App />
      </StaticRouter>
    </DynamicImports>
  );

  expect(wrapper).toMatchSnapshot();
  expect(modules).toMatchSnapshot();
});
