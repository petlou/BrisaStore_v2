import http from 'http';
import socket from 'socket.io';

import ChatController from './app/controllers/ChatController';

import app from './app';

const SERVER_PORT = 3333;
const SERVER_HOST = 'localhost';

app = http.createServer(app);
const io = socket(app);

ChatController.connect(io);

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
  console.log('[HTTP] Listen => Press CTRL+C to stop it!');
});
