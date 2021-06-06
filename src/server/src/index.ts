import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

httpServer.listen(3001);
