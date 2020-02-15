import Product from '../models/Product';

export default async (req, res, next) => {
  const products = await Product.findByPk(req.params.id);

  if (!products) {
    return res.status(400).json({ error: 'PRODUTO NÃO CADASTRADO' });
  }

  return next();
};
