import User from '../models/User';

export default async (req, res, next) => {
  const users = await User.findByPk(req.userId)

  if(!users.provider) {
    return res.status(403).json({ error: 'Usuário não possui permissão de acesso!' });
  }

  return next();
}