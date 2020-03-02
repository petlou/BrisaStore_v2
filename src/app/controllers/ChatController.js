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

      socket.on('chat.message', async (dataMessage, next) => {
        console.log('[SOCKET] Chat.message => ', dataMessage);

        try {
          const users = await User.findByPk(dataMessage.to);

          if (!users) {
            throw new Error('Invalid User');
          } else {
            Message.create({
              sent: user_id,
              received: dataMessage.to,
              message: dataMessage.message,
              date: new Date(),
            });

            io.to(users.id).emit('chat.message', dataMessage);
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
    return res.json('Mostra as Mensagens');
  }

  async update(req, res) {
    return res.json('Edita as Mensagens');
  }

  async destroy(req, res) {
    return res.json('Deleta as Mensagens');
  }
}

export default new ChatController();
