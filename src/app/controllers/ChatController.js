import Message from '../schemas/Message';
import User from '../models/User';

class ChatController {
  connect(io) {
    this.connectedUsers = {};
    this.userRoom = {};

    io.on('connection', socket => {
      const { user_id } = socket.handshake.query;

      this.connectedUsers[user_id] = socket.id;

      console.log('[IO] Connection => Server has a new connection!');
      console.log(
        `[User_ID] => ${user_id} || [Socket_ID] => ${this.connectedUsers[user_id]}`
      );

      socket.on('joining.room', room => {
        socket.join(room);
        this.userRoom[user_id] = room;
        console.log(`[JOINING ROOM] => Room ${this.userRoom[user_id]}`);
        io.broadcast.emit(room);
      });

      socket.on('leaving.room', room => {
        socket.leave(room);
        console.log(`[LEAVING ROOM] => Room ${room}`);
      });

      socket.on('chat.message', async newMessage => {
        const users = await User.findByPk(newMessage.to);

        try {
          if (!users || newMessage.to == user_id) {
            throw new Error('INVALID USER!');
          } else {
            const msg = await Message.create({
              sent: user_id,
              received: newMessage.to,
              message: newMessage.message,
              room: newMessage.room,
              date: new Date(),
            });

            const { _id: id } = msg;

            io.in(newMessage.room).emit('chat.message', newMessage);

            // if (this.connectedUsers[newMessage.to]) {
            //   socket
            //     .in(this.connectedUsers[newMessage.to])
            //     .emit('notification.message', 'Você tem uma nova notificação!');

            if (
              this.userRoom[newMessage.to] === this.userRoom[newMessage.sent]
            ) {
              await Message.findByIdAndUpdate(
                id,
                { read: true },
                { new: true }
              );
            }
          }
        } catch (err) {
          console.error(err.message);
        }
      });

      socket.on('old.message', async oldMessage => {
        const { room } = oldMessage;

        try {
          let messages = await Message.find({ room })
            .select('read sent received room message date')
            .sort({ date: 'asc' });

          if (messages.length == 0) {
            throw new Message('Envie sua mensagem!');
          }

          // eslint-disable-next-line no-return-assign
          messages.find(msg => (msg.read = false));

          messages = messages.reverse();

          io.in(room).emit('old.message', {
            messages,
          });
        } catch (err) {
          console.error(err.message);
        }
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        delete this.userRoom[user_id];
        console.log('[SOCKET] Disconect => A connection has been lost!');
        console.log('[ROOM] Disconect => A room has been lost!');
      });
    });
  }

  async notification_index(req, res) {
    const messages = await Message.find({ read: false })
      .sort({ date: 'asc' })
      .limit(10);

    return res.json(messages);
  }

  // async notification_update(req, res) {
  //   const messages = await Message.findByIdAndUpdate(
  //     req.params.id,
  //     { read: true },
  //     { new: true }
  //   );

  //   return res.json(messages);
  // }
}

export default new ChatController();
