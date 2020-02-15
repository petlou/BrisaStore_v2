import app from './app';

const SERVER_PORT = 3000;
const SERVER_HOST = 'localhost';

app.listen(SERVER_PORT, () => {
  console.log(
    `[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
  console.log('[HTTP] Listen => Press CTRL+C to stop it!');
});
