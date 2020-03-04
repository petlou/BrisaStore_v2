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
