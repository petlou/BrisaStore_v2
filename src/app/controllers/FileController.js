import fs from 'fs';
import { resolve } from 'path';

import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }

  async destroy(req, res) {
    const files = await File.findByPk(req.params.id);

    if (!files) {
      return res.status(401).json('IMAGEM NÃO CADASTRADA!');
    }

    const { path } = files;
    const caminho = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
      path
    );

    await files.destroy();

    fs.unlink(caminho, err => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('IMAGEM EXCLUÍDA!');
    });

    return res.status(200).json('IMAGEM EXCLUÍDA!');
  }
}

export default new FileController();
