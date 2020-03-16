import Message from '../schemas/Message';
import User from '../models/User';
import File from '../models/File';

class ChatController {
  connect(io) {
    this.connectedUsers = {};
    this.connectData = {};
    this.userRoom = {};
    this.userNotification = {};

    io.on('connection', socket => {
      let { user_id } = socket.handshake.query;
      const { name } = socket.handshake.query;
      user_id = Number(user_id);

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
        if (this.userRoom[user_id] === room) {
          delete this.userRoom[user_id];
        }
        console.log(`[LEAVING ROOM] => Room ${room}`);
      });

      socket.on('chat.message', async newMessage => {
        const users = await User.findByPk(newMessage.to);

        try {
          if (!users || newMessage.to === user_id) {
            throw new Error('INVALID USER!');
          } else {
            let messages = await Message.create({
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
                const user = await User.findByPk(user_id, {
                  attributes: ['id', 'name', 'avatar_id'],
                  include: [
                    {
                      model: File,
                      as: 'avatar',
                      attributes: ['name', 'path', 'url'],
                    },
                  ],
                });

                if (this.userNotification[user_id]) {
                  const quant = this.userNotification[newMessage.sent]
                    .notification;

                  this.userNotification[newMessage.sent].message =
                    newMessage.message;

                  this.userNotification[newMessage.sent].notification =
                    quant + 1;
                } else {
                  this.userNotification[newMessage.sent] = {
                    sent: newMessage.sent,
                    received: newMessage.to,
                    message: newMessage.message,
                    notification: 1,
                    user,
                  };
                }

                // const data = { user: userMsg, mensagem: newMessage.message };

                socket
                  .in(this.connectedUsers[newMessage.to])
                  .emit('notification.message', this.userNotification);
              } catch (err) {
                console.error(err);
              }
            }

            if (
              this.userRoom[newMessage.to] === this.userRoom[newMessage.sent]
            ) {
              const { _id: idMsg } = messages;
              messages = await Message.findOneAndUpdate(
                { _id: idMsg },
                { read: true },
                { new: true }
              );

              io.in(newMessage.room).emit('chat.message', messages);
              // io.in().emit('view.message', msg.read);
              // console.log(`[READ] => ${msg.read}`);
            } else {
              io.in(newMessage.room).emit('chat.message', messages);
            }
          }
        } catch (err) {
          console.warn(err.message);
        }
      });

      socket.on('old.message', async oldMessage => {
        const { room } = oldMessage;

        try {
          try {
            await Message.updateMany(
              { read: false, room, received: user_id },
              { read: true },
              { new: true }
            );

            delete this.userNotification[oldMessage.adminId];
            io.emit('notification.message', this.userNotification);
          } catch (err) {
            console.error(err);
          }

          const messages = await Message.find({ room })
            .select('read sent received room message date')
            .sort({ date: 'asc' });

          if (messages.length === 0) {
            messages.push('Envie sua mensagem!');
          }

          io.in(room).emit('old.message', {
            messages,
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('disconnect', () => {
        const object = this.connectedUsers[user_id];
        const conect = this.connectedUsers[user_id];
        const room = this.userRoom[user_id];
        delete this.connectedUsers[user_id];
        delete this.connectData[user_id];
        delete this.userRoom[user_id];
        console.log(
          `[SOCKET] [${conect}] Disconect => A connection has been lost!`
        );
        console.log(`[ROOM] [${room}] Disconect => A room has been lost!`);
        console.log(`[TESTE] => ${object}`);

        io.emit('connected.users', this.connectData);
      });
    });
  }

  async notification_index(req, res) {
    this.userNotification = {};
    const messages = await Message.find({
      read: false,
      received: req.userId,
    }).sort({ date: 'asc' });

    if (!messages) {
      return res.json("USER DOESN'T HAVE NOTIFICATIONS");
    }

    for (const message of messages) {
      if (this.userNotification[message.sent]) {
        const quant = this.userNotification[message.sent].notification;

        this.userNotification[message.sent].notification = quant + 1;
      } else {
        this.userNotification[message.sent] = {
          sent: message.sent,
          received: message.received,
          notification: 1,
        };
      }
    }

    // for await (const [idx, message] of messages.entries()) {
    //   const user_sent = await User.findByPk(message.sent, {
    //     attributes: ['id', 'name', 'email', 'avatar_id'],
    //     include: [
    //       {
    //         model: File,
    //         as: 'avatar',
    //         attributes: ['name', 'path', 'url'],
    //       },
    //     ],
    //   });

    //   messages[idx] = { message, user_sent };
    // }

    return res.json(this.userNotification);
  }
}

export default new ChatController();
