import User from '../models/User';

class SessionController {
  async update(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'USUÁRIO NÃO CADASTRADO!' });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(401)
        .json({ error: 'A SENHA NÃO CORRESPONDE AO USUÁRIO!' });
    }

    const { id, name, provider } = user;
    let { auth_token } = user;

    if (!user.auth_token) {
      const token = await user.generateToken(id);
      console.log(`[TOKEN] => ${token}`);

      await user.update({ auth_token: token });

      auth_token = token;
    }

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
      },
      auth_token,
    });
  }
}

export default new SessionController();
