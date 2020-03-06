import Message from '../schemas/Message';
import User from '../models/User';
import File from '../models/File';

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
        socket.emit('joining.room', room);
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
            const { _id: idMsg } = await Message.create({
              sent: user_id,
              received: newMessage.to,
              message: newMessage.message,
              room: newMessage.room,
              date: new Date(),
            });

            // const { _id: id } = msg;

            io.in(newMessage.room).emit('chat.message', newMessage);

            if (
              this.connectedUsers[newMessage.to] &&
              this.userRoom[newMessage.to] !== this.userRoom[newMessage.sent]
            ) {
              try {
                const data = await User.findByPk(user_id, {
                  attributes: ['id', 'name', 'avatar_id'],
                  include: [
                    {
                      model: File,
                      as: 'avatar',
                      attributes: ['name', 'path', 'url'],
                    },
                  ],
                });

                socket
                  .in(this.connectedUsers[newMessage.to])
                  .emit('notification.message', data);
              } catch (err) {
                console.log(err);
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
            }
          }
        } catch (err) {
          console.error(err.message);
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
          console.log(err);
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
    const messages = await Message.find({ read: false, received: req.userId })
      .sort({ date: 'asc' })
      .limit(10);

    const users = await User.findByPk(messages.sent, {
      attributes: ['id', 'name', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(messages, users);
  }
}

export default new ChatController();
