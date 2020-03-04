import Message from '../schemas/Message';
import User from '../models/User';

class ChatController {
  connect(io) {
    this.connectedUsers = {};

    io.on('connection', socket => {
      const { user_id } = socket.handshake.query;

      this.connectedUsers[user_id] = socket.id;

      console.log('[IO] Connection => Server has a new connection!');
      console.log(
        `[User_ID] => ${user_id} || [Socket_ID] => ${this.connectedUsers[user_id]}`
      );

      socket.on('joining.room', room => {
        socket.join(room);
        console.log(`[JOINING ROOM] => Room ${room}`);
      });

      socket.on('chat.message', async newMessage => {
        const users = await User.findByPk(newMessage.to);

        try {
          if (!users || newMessage.to == user_id) {
            throw new Error('INVALID USER!');
          } else {
            Message.create({
              sent: user_id,
              received: newMessage.to,
              message: newMessage.message,
              room: newMessage.room,
              date: new Date(),
            });

            io.in(newMessage.room).emit('chat.message', newMessage);
          }
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('old.message', async oldMessage => {
        const { room } = oldMessage;

        try {
          let messages = await Message.find({ where: { room } })
            .select('read sent received room message date')
            .sort({ date: 'asc' });

          if (!messages) {
            throw new Message('Envie sua mensagem!');
          }

          messages = messages.reverse();

          socket.in(room).emit('old.message', {
            messages,
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        console.log('[SOCKET] Disconect => A connection has been lost!');
      });
    });
  }
}

export default new ChatController();
