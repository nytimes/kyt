
/*
 * Demo server index.js file
 * kyt expects every app to have this entry point.
 *
*/
import express from 'express';
const clientAssets = require(process.env.ASSETS_PATH);

const app = express();
app.disable('x-powered-by');

app.use(process.env.PUBLIC_PATH, express.static(process.env.CLIENT_BUILD_PATH));

app.get('/', (req, res) => {
  res.send(
    "<body>" +
      "<div id='root'></div>" +
      `<script src='${clientAssets.main.js}'></script>` +
    "</body>"
  );
});

app.listen(parseInt(process.env.SERVER_PORT, 10));
