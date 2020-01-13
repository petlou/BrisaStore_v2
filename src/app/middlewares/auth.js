import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import User from '../models/User';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(' ');

  const users = await User.findOne({ where: { auth_token: token } });

  if(!users) {
    return res.status(401).json({ error: 'USUÁRIO NÃO CADASTRADO!' });
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'USUÁRIO NÃO AUTENTICADO!' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'TOKEN DE AUTENTICAÇÃO INVÁLIDO!' });
  }
};