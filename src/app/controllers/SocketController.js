class SocketController {
  connect(io) {
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
  }
}

export default new SocketController();

// export default io => {
//   io.on('connection', socket => {
//     console.log('[IO] Connection => Server has a new connection!');
//     socket.on('chat.message', data => {
//       console.log('[SOCKET] Chat.message => ', data);
//       io.emit('chat.message', data);
//     });
//     socket.on('disconect', () => {
//       console.log('[SOCKET] Disconect => A connection has been lost!');
//     });
//   });
// };
