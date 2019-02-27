/* eslint-disable prefer-template, max-len */

const getDeferScript = src => `<script defer src="${src}"></script>`;

export default ({ html, bundles }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <meta httpEquiv="Content-Language" content="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link id="favicon" rel="shortcut icon" href="/kyt-favicon.png" sizes="16x16 32x32" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css" />
    ${bundles.cssBundle ? `<link rel="stylesheet" href="${bundles.cssBundle}" />` : ''}
    ${bundles.styles.map(e => `<link rel="stylesheet" href="${e}">`).join('\n')}
    <title>Universal React Starter Kyt</title>
  </head>
  <body>
    <div id="root">${html}</div>
    ${bundles.runtimeBundle ? getDeferScript(bundles.runtimeBundle) : ''}
    ${bundles.vendorBundle ? getDeferScript(bundles.vendorBundle) : ''}
    ${bundles.scripts.map(getDeferScript).join('\n')}
    ${bundles.entryBundle ? getDeferScript(bundles.entryBundle) : ''}
  </body>
</html>
`;
