import Message from '../schemas/Message';

class ChatController {
  connect(io) {
    this.connectedUsers = {};

    io.on('connection', socket => {
      let { user_id } = socket.handshake.query;
      user_id = Number(user_id);

      this.connectedUsers[user_id] = socket.id;

      console.log('[IO] Connection => Server has a new connection!');
      console.log(`[Socket_ID] ${this.connectedUsers[user_id]}`);
      console.log(`[User_ID] ${user_id}`);

      socket.on('chat.message', data => {
        console.log('[SOCKET] Chat.message => ', data);

        Message.create({
          sent: user_id,
          received: user_id + 1,
          message: data.message,
          date: new Date(),
        });

        io.emit('chat.message', data);
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        console.log('[SOCKET] Disconect => A connection has been lost!');
      });
    });
  }
}

export default new ChatController();
