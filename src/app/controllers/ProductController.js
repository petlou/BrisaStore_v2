import { resolve } from 'path';

import Product from '../models/Product';
import File from '../models/File';
import Unlink from '../utils/UnlinkFile';

class ProductController {
  async index(req, res) {
    const products = await Product.findAll({
      attributes: [
        'id',
        'modelo',
        'descricao',
        'quantidade',
        'preco',
        'imagem_id',
      ],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (products.length < 1) {
      return res.status(400).json({ error: 'NÃO HÁ PRODUTOS CADASTRADOS!' });
    }

    return res.json(products);
  }

  async show(req, res) {
    const products = await Product.findAll({
      where: { modelo: req.params.modelo },
      attributes: [
        'id',
        'modelo',
        'descricao',
        'quantidade',
        'preco',
        'imagem_id',
      ],
      include: [
        {
          model: File,
          as: 'imagem',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (products.length < 1) {
      return res.status(400).json({ error: 'NÃO HÁ PRODUTOS CADASTRADOS!' });
    }

    return res.json(products);
  }

  async store(req, res) {
    const { preco } = req.body;

    if (preco < 1.0) {
      return res.status(400).json({ error: 'VALOR NÃO É VÁLIDO' });
    }

    const products = await Product.create(req.body);

    return res.json(products);
  }

  async update(req, res) {
    const products = await Product.findByPk(req.params.id);

    let { quantidade } = products;

    const {
      modelo,
      descricao,
      preco,
      quantidade: quantidadeRecebida,
    } = req.body;

    if (preco < 1.0) {
      return res.status(400).json({ error: 'VALOR NÃO É VÁLIDO!' });
    }

    if (req.body.quantidade) {
      quantidade += quantidadeRecebida;
      if (quantidade < 0) {
        return res
          .status(400)
          .json({ error: 'SALDO NEGATIVO NÃO É PERMITIDO!' });
      }
      products.update({
        quantidade,
      });
    }

    products.update({
      modelo,
      descricao,
      preco,
    });

    return res.json(products);
  }

  async destroy(req, res) {
    const products = await Product.findByPk(req.params.id);

    const { imagem_id } = products;
    await products.destroy();

    if (imagem_id) {
      const { path: oldPath } = await File.findByPk(imagem_id);
      const pathing = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        oldPath
      );

      await (await File.findByPk(imagem_id)).destroy();

      await Unlink(pathing);
    }

    return res.status(200).json({ message: 'PRODUTO REMOVIDO!' });
  }
}

export default new ProductController();
