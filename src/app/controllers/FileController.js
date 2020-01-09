import fs from 'fs';
import { resolve } from 'path';

import File from '../models/File';
import Product from '../models/Product';

class FileController {
  async store (req, res) {
    const { originalname: name, filename: path} = req.file;

    const file = await File.create({
      name,
      path
    });

    return res.json(file);
  }

  async storeProduct (req, res) {
    const products = await Product.findByPk(req.params.id);

    if (!products) {
      return res.status(401).json({ error: 'Produto não encontrado!' });
    }

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    products.update({ imagem_id: file.id });

    return res.json({file, products});
  }

  async destroy (req, res) {
    const files = await File.findByPk(req.params.id);

    if(!files) {
      return res.status(401).json('Imagem não existe!');
    }

    const { path } = files;
    const caminho = resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', path);

    await (files).destroy();

    fs.unlink(caminho, (err) =>{
      if (err) {
        console.error(err)
        return
      }
      console.log('Imagem excluída!')
    })

    return res.status(200).json('Imagem excluída!');
  }
}

export default new FileController();