import http from 'http';
import socketio from 'socket.io';

import app from './app';

const SERVER_PORT = 3333;
const SERVER_HOST = '10.1.4.53';

app = http.createServer(app);
const io = socketio(app);

io.on('connection', socket => {
  console.log('[IO] Connection => Server has a new connection!');
  socket.on('chat.message', data => {
    console.log('[SOCKET] Chat.message => ', data);
    io.emit('chat.message', data);
  });
  socket.on('disconect', () => {
    console.log('[SOCKET] Disconect => A connection has been lost!');
  });
});

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `[HTTP] Listen => Server is running at http://${SERVER_HOST}:${SERVER_PORT}`
  );
  console.log('[HTTP] Listen => Press CTRL+C to stop it!');
});
