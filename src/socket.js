import http from 'http';
import Server from 'socket.io';

class Socket {
  constructor() {
    this.connect();
  }

  connect() {
    this.server = http.createServer();
    const io = Server(this.server);

    io.on('connection', () => {
      console.log('[IO] Connection => Server has a new connection!');
    });
  }
}

export default new Socket();
