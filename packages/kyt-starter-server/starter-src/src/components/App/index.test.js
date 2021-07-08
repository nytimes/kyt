import React from 'react';
import { render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';
import { DynamicImports } from 'kyt-runtime/server';
import App, { Home, Tools } from '.';

describe('App', () => {
  it('Test home route', async () => {
    await Home.preload();
    const modules = [];
    const { container } = render(
      <DynamicImports report={module => modules.push(module)}>
        <StaticRouter location="/" context={{}}>
          <App />
        </StaticRouter>
      </DynamicImports>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(modules).toMatchSnapshot();
  });

  it('Test tools route', async () => {
    await Tools.preload();
    const modules = [];
    const { container } = render(
      <DynamicImports report={module => modules.push(module)}>
        <StaticRouter location="/tools" context={{}}>
          <App />
        </StaticRouter>
      </DynamicImports>
    );

    expect(container.firstChild).toMatchSnapshot();
    expect(modules).toMatchSnapshot();
  });
});
