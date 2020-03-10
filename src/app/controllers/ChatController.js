import Message from '../schemas/Message';
import User from '../models/User';
import File from '../models/File';

class ChatController {
  connect(io) {
    this.connectedUsers = {};
    this.connectData = {};
    this.userRoom = {};

    io.on('connection', socket => {
      const { user_id, name } = socket.handshake.query;

      this.connectedUsers[user_id] = socket.id;
      this.connectData[user_id] = { user_id, name };

      console.log('[IO] Connection => Server has a new connection!');
      console.log(
        `[User_ID] => ${user_id} || [Socket_ID] => ${this.connectedUsers[user_id]}`
      );

      io.emit('connected.users', this.connectData);

      socket.on('joining.room', room => {
        socket.join(room);
        this.userRoom[user_id] = room;
        console.log(`[JOINING ROOM] => Room ${this.userRoom[user_id]}`);
        socket.emit('joining.room', room);
      });

      socket.on('leaving.room', room => {
        socket.leave(room);
        delete this.userRoom[user_id];
        console.log(`[LEAVING ROOM] => Room ${room}`);
      });

      socket.on('chat.message', async newMessage => {
        const users = await User.findByPk(newMessage.to);

        try {
          if (!users || newMessage.to == user_id) {
            throw new Error('INVALID USER!');
          } else {
            const { _id: idMsg } = await Message.create({
              sent: user_id,
              received: newMessage.to,
              message: newMessage.message,
              room: newMessage.room,
              date: new Date(),
            });

            if (
              this.connectedUsers[newMessage.to] &&
              this.userRoom[newMessage.to] !== this.userRoom[newMessage.sent]
            ) {
              try {
                const userMsg = await User.findByPk(user_id, {
                  attributes: ['id', 'name', 'avatar_id'],
                  include: [
                    {
                      model: File,
                      as: 'avatar',
                      attributes: ['name', 'path', 'url'],
                    },
                  ],
                });

                const data = { user: userMsg, mensagem: newMessage.message };

                socket
                  .in(this.connectedUsers[newMessage.to])
                  .emit('notification.message', data);
              } catch (err) {
                console.error(err);
              }
            }

            if (
              this.userRoom[newMessage.to] === this.userRoom[newMessage.sent]
            ) {
              await Message.updateOne(
                { _id: idMsg },
                { read: true },
                { new: true }
              );

              io.in(newMessage.room).emit('chat.message', newMessage);
            }
          }
        } catch (err) {
          console.warn(err.message);
        }
      });

      socket.on('old.message', async oldMessage => {
        const { room } = oldMessage;

        try {
          const messages = await Message.find({ room })
            .select('read sent received room message date')
            .sort({ date: 'asc' });

          if (messages.length == 0) {
            messages.push('Envie sua mensagem!');
          }

          await Message.updateMany(
            { read: false, room, received: user_id },
            { read: true },
            { new: true }
          );

          io.in(room).emit('old.message', {
            messages,
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        delete this.connectData[user_id];
        delete this.userRoom[user_id];
        console.log('[SOCKET] Disconect => A connection has been lost!');
        console.log('[ROOM] Disconect => A room has been lost!');

        io.emit('connected.users', this.connectData);
      });
    });
  }

  async notification_index(req, res) {
    const messages = await Message.find({
      read: false,
      received: req.userId,
    }).sort({ date: 'asc' });

    if (!messages) {
      return res.json('Não existem novas notificações!');
    }

    for await (const [idx, message] of messages.entries()) {
      const user_sent = await User.findByPk(message.sent, {
        attributes: ['id', 'name', 'email', 'avatar_id'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });

      messages[idx] = { message, user_sent };
    }

    return res.json(messages);
  }
}

export default new ChatController();
