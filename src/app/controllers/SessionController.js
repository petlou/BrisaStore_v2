import jwt from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async update(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if(!user) {
      return res.status(401).json({ error: 'Usuário não cadastrado!' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'A senha não corresponde ao Usuário!'});
    }

    const { id, name, provider } = user;
    let { auth_token } = user;

    if(!user.auth_token) {
      const token = jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      });

      await user.update({auth_token: token});

      auth_token = token;
    }

    return res.json({
      user: {
        id,
        name,
        email,
        provider
      },
      auth_token
    });
  }
}

export default new SessionController();