import { resolve } from 'path';

import User from '../models/User';
import File from '../models/File';
import Unlink from '../utils/UnlinkFile';

class User_FileController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    const { avatar_id } = user;
    const { id } = file;

    if (avatar_id) {
      const oldFile = await File.findByPk(avatar_id);
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

    user.update({ avatar_id: id });

    return res.json({ file, user });
  }
}

export default new User_FileController();
