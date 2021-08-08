import { Socket } from 'socket.io-client';

class Listener {
  socket: Socket;

  constructor(socket: Socket) {

    this.socket = socket;
  }
}

export default Listener;
