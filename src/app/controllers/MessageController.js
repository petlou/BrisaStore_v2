import Chat from '../models/Chat';
import Message from '../schemas/Message';
import User from '../models/User';
import File from '../models/File';


class MessageController {
  async show(req, res) {
    
    return res.json('post create');
  }

  async store(req, res) {
    const { id } = req.body;
    const users = await User.findOne({ where: { id, provider: true } })

    if (!id) {
      return res.json('Necessário selecionar um provider para iniciar conversa!');
    }

    if (!users) {
      return res.json('Usuário não existe ou não é um provider!');
    }

    console.log(`Variável users ${users} || id ${id}`);

    const { chat_id } = await Chat.create({
      user_id: req.userId,
      provider_id: req.body.id
    });

    console.log(`chat_id ${chat_id}`);

    const messages = await Message.create({
      chatId: chat_id,
      message: req.body.message
    });

    return res.json({messages});
  }

  async update (req, res) {

    return res.json('post update');
  }
}

export default new MessageController();