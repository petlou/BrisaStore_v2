import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';
import BlackList from '../models/BlackList';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [, token] = authHeader.split(' ');
  const blackLists = await BlackList.findOne({ where: { auth_token: token }});

  console.log(`black = ${blackLists}`);

  if(blackLists) {
    return res.status(401).json({ error: 'PERMISSÃO NEGADA!' });
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'LOGIN NÃO REALIZADO!' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'PERMISSÃO NEGADA!' });
  }
};