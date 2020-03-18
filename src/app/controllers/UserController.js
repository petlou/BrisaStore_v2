import { resolve } from 'path';

import User from '../models/User';
import File from '../models/File';

import Unlink from '../utils/UnlinkFile';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      where: { provider: false },
      attributes: ['id', 'name', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  async show(req, res) {
    const users = await User.findByPk(req.userId, {
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'USUÁRIO JÁ CADASTRADO!' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async storeAvatar(req, res) {
    const users = await User.findByPk(req.userId);

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const { avatar_id } = users;

    if (avatar_id) {
      const { path: oldPath } = await File.findByPk(avatar_id);
      const pathing = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        oldPath
      );

      await (await File.findByPk(avatar_id)).destroy();

      await Unlink(pathing);
    }

    users.update({ avatar_id: file.id });

    return res.json({ file, users });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'USUÁRIO JÁ CADASTRADO!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ error: 'SENHA NÃO CORRESPONDE COM A ATUAL!' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async destroy(req, res) {
    const users = await User.findByPk(req.userId);

    const { avatar_id } = users;
    await users.destroy();

    if (avatar_id) {
      const { path: oldPath } = await File.findByPk(avatar_id);
      const pathing = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        oldPath
      );

      await (await File.findByPk(avatar_id)).destroy();

      await Unlink(pathing);
    }

    return res.send({ message: 'CONTA DESATIVADA!' });
  }
}

export default new UserController();
