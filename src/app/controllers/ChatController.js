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
      // console.log(`[User_ID] ${user_id}`);

      socket.on('chat.message', async dataMessage => {
        console.log('[SOCKET] Chat.message => ', dataMessage);

        try {
          const users = await User.findByPk(dataMessage.to);
          // console.log(`[User_ID] ${users.id}`);

          if (!users || dataMessage.to === user_id) {
            throw new Error('Invalid User');
          } else {
            const socketId = this.connectedUsers[user_id];
            console.log(`[Owner] ${socketId} => Owner Socket!`);

            Message.create({
              sent: user_id,
              received: dataMessage.to,
              message: dataMessage.message,
              date: new Date(),
            });

            io.emit('chat.message', dataMessage);

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

    const messages = await Message.find({
      $and: [
        { $or: [{ sent: userSent }, { received: userSent }] },
        { $or: [{ sent: userReceived }, { received: userReceived }] },
      ],
    })
      .select('read')
      .select('sent')
      .select('received')
      .select('message')
      .select('date')
      .sort({ date: 'desc' })
      .limit(limitPage)
      .skip((page - 1) * limitPage);

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
