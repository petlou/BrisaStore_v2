import { resolve } from 'path';

import File from '../models/File';
import Unlink from '../utils/UnlinkFile';

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
    const pathing = resolve(
      __dirname,
      '..',
      '..',
      '..',
      'tmp',
      'uploads',
      path
    );

    await files.destroy();

    await Unlink(pathing);

    return res.status(200).json('IMAGEM EXCLUÍDA!');
  }
}

export default new FileController();
