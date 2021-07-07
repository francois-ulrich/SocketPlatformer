import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import GameRoom from './other/GameRoom';
import GameRoomMetadata from './types/gameRoomMetadata';

// Socket.IO server instanciation
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Map storing room data for each socket room
const gameRooms: Map<string, GameRoomMetadata> = new Map<string, GameRoomMetadata>();

io.on('connection', (socket: Socket) => {
  console.log('A user connected !');

  // Socket joins the test room
  socket.join('test');

  // Tell the client to create a player instance
  socket.broadcast.emit('createPlayer');

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log('A user disconnected!');
  });
});

// On room creation, a few things need to be done
io.of('/').adapter.on('create-room', (room: string) => {
  console.log(`Room "${room}" has been created`);

  const gameRoom = new GameRoom();

  // Create linked game room
  gameRooms.set(room, gameRoom);
});

io.of('/').adapter.on('delete-room', (room: string) => {
  console.log(`Room "${room}" has been deleted`);
});

io.of('/').adapter.on('join-room', (room, socketId) => {
  // If the room is the socket's own default room
  if (room === socketId) {
    return;
  }

  // Get gameRoom
  const gameRoom: GameRoom | undefined = gameRooms.get(room);

  // If no gameRoom corresponding to given room name is found, exit event,
  if (gameRoom === undefined) {
    return;
  }

  // Get linked socket
  const socket: Socket | undefined = io.sockets.sockets.get(socketId);

  if (socket === undefined) {
    return;
  }

  console.log(`Socket ${socketId} has joined room ${room}`);

  socket.emit('hello');
});

io.of('/').adapter.on('leave-room', (room, socketId) => {
  console.log(`Socket ${socketId} has left room ${room}`);
});

const port = process.env.PORT || 5000;
httpServer.listen(port);
