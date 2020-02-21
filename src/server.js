import http from 'http';
import socket from 'socket.io';
import SocketController from './app/controllers/SocketController';

import app from './app';

const SERVER_PORT = 3333;
const SERVER_HOST = '10.1.4.53';

app = http.createServer(app);
const io = socket(app);

SocketController.connect(io);

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
  console.log('[HTTP] Listen => Press CTRL+C to stop it!');
});
