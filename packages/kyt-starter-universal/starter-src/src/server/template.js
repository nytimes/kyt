import favicon from '../public/kyt-favicon.png';

const getDeferScript = src => `<script defer src="${src}"></script>`;

export default ({ html, ids, css, bundles }) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Universal React Starter Kyt</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Language" content="en" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link id="favicon" rel="shortcut icon" href="${favicon}" sizes="16x16 32x32" type="image/png" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
    <style data-lights-css="${ids.join(' ')}">${css}</style>
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
