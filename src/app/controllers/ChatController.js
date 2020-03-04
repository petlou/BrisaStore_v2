import Message from '../schemas/Message';
import User from '../models/User';

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

      socket.on('old.message', async oldMessage => {
        const { userId, adminId, quantData } = oldMessage;

        const limitData = 5 * quantData;

        try {
          let messages = await Message.find({
            $and: [
              { $or: [{ sent: userId }, { received: userId }] },
              { $or: [{ sent: adminId }, { received: adminId }] },
            ],
          })
            .select('read sent received message date')
            .sort({ date: 'asc' })
            .limit(limitData);

          messages = messages.reverse();

          const idReceived = this.connectedUsers[adminId];

          io.to(idReceived).emit('old.message', {
            messages,
            quantData,
          });
        } catch (err) {
          console.error(err);
        }
      });

      socket.on('chat.message', async newMessage => {
        console.log('[SOCKET] Chat.message => ', newMessage);

        try {
          const users = await User.findByPk(newMessage.to);

          if (!users || newMessage.to === user_id) {
            throw new Error('Invalid User');
          } else {
            console.log(
              `[USER ID] ${this.connectedUsers[user_id]} => Owner Socket!`
            );
            const idReceived = this.connectedUsers[newMessage.to];
            console.log(`[ADMIN ID] ${idReceived} => Owner Socket!`);

            Message.create({
              sent: user_id,
              received: newMessage.to,
              message: newMessage.message,
              date: new Date(),
            });

            io.to(idReceived).emit('chat.message', newMessage);

            // const socketId = this.connectedUsers[user_id];
            // console.log(`[Owner] ${socketId} => Owner Socket!`);
            // if (socketId) {
            //   io.to(socketId).emit('notifications', notifications);
            //   console.log(`[User] ${users.name} => Received Notification!`);
            //   console.log(`[Notification] ${notifications}`);
            // }
          }
        } catch (err) {
          console.error(err.message);
        }
      });

      socket.on('disconnect', () => {
        delete this.connectedUsers[user_id];
        console.log('[SOCKET] Disconect => A connection has been lost!');
      });
    });
  }

  async index(req, res) {
    const userSent = req.userId;
    const userReceived = req.params.id;
    const { page } = req.query;
    const limitPage = 5;

    console.log(`[USERSENT] => ${userSent}`);
    console.log(`[USERRECEIVED] => ${userReceived}`);

    let messages = await Message.find({
      $and: [
        { $or: [{ sent: userSent }, { received: userSent }] },
        { $or: [{ sent: userReceived }, { received: userReceived }] },
      ],
    })
      .select('read sent received message date')
      .sort({ date: 'asc' })
      .limit(limitPage)
      .skip((page - 1) * limitPage);

    messages = messages.reverse();

    return res.json(messages);
  }

  async update(req, res) {
    return res.json('Edita as Mensagens');
  }

  async destroy(req, res) {
    return res.json('Deleta as Mensagens');
  }
}

export default new ChatController();
