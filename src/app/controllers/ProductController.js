import * as Yup from 'yup';

import Product from '../models/Product';

class ProductController {
  async index(req, res) {
    return res.json(await Product.findAll())
  }

  async show(req, res) {
    const produtos = await Product.findAll({ where: { modelo: req.params.modelo } });

    return res.json(produtos);
  }

  async store(req, res) {
    const schema = await Yup.object().shape({
      modelo: Yup.string().required(),
      descricao: Yup.string(),
      quantidade: Yup.number().integer(),
      preco: Yup.number(),
      imagem_url: Yup.string().url()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    const produtos = await Product.create(req.body);

    return res.json(produtos);
  }

  async update(req, res) {
    const schema = await Yup.object().shape({
      modelo: Yup.string(),
      descricao: Yup.string(),
      quantidade: Yup.number().integer(),
      preco: Yup.number(),
      imagem_url: Yup.string().url()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validação falhou!' });
    }

    if (!(await Product.findByPk(req.params.id))) {
      return res.status(401).json({ error: 'Produto não encontrado!' });
    }

    const produtos = await Product.findByPk(req.params.id);

    produtos.update(req.body);

    return res.json(produtos);
  }

  async destroy(req, res) {
    if (!(await Product.findByPk(req.params.id))) {
      return res.status(401).json({ error: 'Produto não encontrado!' });
    }

    await (await Product.findByPk(req.params.id)).destroy();

    return res.status(200).json({ message: 'Produto excluído!'});
  }
}

export default new ProductController();