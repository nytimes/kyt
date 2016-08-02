
export default (vo) => `

<!DOCTYPE html>
<html lang="en">

  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta charSet='utf-8' />
    <meta httpEquiv="Content-Language" content="en" />
    <style type="text/css" id="server-side-styles">${vo.css}</style>
    <title>React kyt</title>
  </head>

  <body>
    <div id="root">${vo.root}</div>
    <script src="${vo.jsBundle}"></script>
  </body>

</html>

`;
