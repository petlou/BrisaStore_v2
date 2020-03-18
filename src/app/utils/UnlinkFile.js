import fs from 'fs';

export default pathing => {
  fs.unlink(pathing, err => {
    if (err) {
      console.error(err);
    }
    console.log('AVATAR ANTIGO EXCLUÍDO!');
  });
};
