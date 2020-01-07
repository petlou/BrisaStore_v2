import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const userExists = await User.findOne({ where: {email: req.body.email } });

    if(userExists) {
      return res.status(400).json({ error: 'Usuário já existe! '});
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
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
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const { email, oldPassword} = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({ error: 'Usuário não cadastrado!' });
    }

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe!' });
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
    if (!(await User.findByPk(req.userId))) {
      return res.status(401).json({ error: 'Usuário não cadastrado!' });
    }
    
    await (await User.findByPk(req.userId)).destroy();

    return res.send({ message: 'Usuário deletado' });
  }
}

export default new UserController();