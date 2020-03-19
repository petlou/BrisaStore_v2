import { resolve } from 'path';

import Product from '../models/Product';
import File from '../models/File';
import Unlink from '../utils/UnlinkFile';

class Product_FileController {
  async store(req, res) {
    const product = await Product.findByPk(req.params.id);

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const { imagem_id } = product;
    const { id } = file;

    if (imagem_id) {
      const oldFile = await File.findByPk(imagem_id);
      const { path: oldPath } = oldFile;
      const pathing = resolve(
        __dirname,
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        oldPath
      );

      await oldFile.destroy();

      await Unlink(pathing);
    }

    product.update({ imagem_id: id });

    return res.json({ file, product });
  }
}

export default new Product_FileController();
