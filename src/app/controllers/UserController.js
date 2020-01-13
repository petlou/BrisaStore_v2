import * as Yup from 'yup';
import fs from 'fs';
import { resolve } from 'path';

import User from '../models/User';
import File from '../models/File';

class UserController {
  async show(req, res) {
    const { name, email, avatar_id } = await User.findByPk(req.userId);
    const { name: nameFile, path, url } = await File.findByPk(avatar_id);

    return res.json({
      name,
      email,
      imagem: {
        nameFile,
        path,
        url
      }
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'VERIFICAR CAMPOS!' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if(userExists) {
      return res.status(400).json({ error: 'USUÁRIO JÁ EXISTE!' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async storeUser (req, res) {
    const users = await User.findByPk(req.userId);

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    let { avatar_id } = users;

    if(avatar_id) {
      const { path: oldPath } = await File.findByPk(avatar_id);
      const pathing = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', oldPath);

      await (await File.findByPk(avatar_id)).destroy();

      fs.unlink(pathing, (err) =>{
        if (err) {
          console.error(err)
        }
        console.log('AVATAR ANTIGO EXCLUÍDO!')
      });
    };

    users.update({ avatar_id: file.id });

    return res.json({file, users});
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) => 
        password ? field.required().oneOf([Yup.ref('password')]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'VERIFICAR CAMPOS!' });
    }

    const { email, oldPassword} = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não cadastrado!' });
    }

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'USUÁRIO JÁ EXISTE!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha não coincide com a atual!' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async destroy (req, res) {
    const users = await User.findByPk(req.userId);

    if (!users) {
      return res.status(401).json({ error: 'USUÁRIO NÃO CADASTRADO!' });
    }
    
    await users.destroy();

    return res.send({ message: 'CONTA DESATIVADA!' });
  }
}

export default new UserController();