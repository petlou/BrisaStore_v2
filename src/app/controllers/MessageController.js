import Chat from '../models/Chat';
import Message from '../schemas/Message';
import User from '../models/User';
import File from '../models/File';

class MessageController {
  async show(req, res) {
    return res.json('post create');
  }

  async store(req, res) {
    const { id: idAdmin } = req.body;

    if (!idAdmin) {
      return res.json(
        'Necessário selecionar um provider para iniciar conversa!'
      );
    }

    const users = await User.findOne({
      where: { id: idAdmin, provider: true },
    });

    if (!users) {
      return res.json('Usuário não existe ou não é um provider!');
    }

    let chatExists = await Chat.findOne({
      where: {
        user_id: req.userId,
        provider_id: idAdmin,
      },
    });

    if (!chatExists) {
      chatExists = await Chat.create({
        user_id: req.userId,
        provider_id: req.body.id,
      });
    }

    const { id } = chatExists;

    let messages = await Message.create({
      chatId: id,
      message: req.body.message,
      date: new Date(),
    });

    messages = await Message.find({ chatId: id }).sort({ date: 'asc' });

    const chatMessages = await Chat.findAll({
      where: {
        id,
      },
      attributes: ['user_id', 'provider_id'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ chatMessages, messages });
  }

  async answer(req, res) {
    return res.json('post answer');
  }

  async update(req, res) {
    return res.json('put update');
  }
}

export default new MessageController();
