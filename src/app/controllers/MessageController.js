import User from '../models/User';

export default async req => {
  const { id } = User.findByPk(req.userId);
  console.log(`[ID] - ${id}`);

  this.socket.on('chat.message', data => {
    console.log(data);
    req.io.emit('chat.message', data);
  });
};
