import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Entity } from 'super-ecs';

// Other
import GameRoom from './other/GameRoom';
// import GameLoop from './other/GameLoop';

// ECS Stuff

// Component
import PositionComponent from './components/PositionComponent';
import VelocityComponent from './components/VelocityComponent';
import MapComponent from './components/MapComponent';
import CollisionComponent from './components/CollisionComponent';
import PlayerComponent from './components/PlayerComponent';
import CharacterComponent from './components/CharacterComponent';

// System
import VelocitySystem from './systems/VelocitySystem';
import GravitySystem from './systems/GravitySystem';
import MapSystem from './systems/MapSystem';
import PlayerSystem from './systems/PlayerSystem';
import CharacterSystem from './systems/CharacterSystem';
import CollisionSystem from './systems/CollisionSystem';

// Test map
import map from './assets/maps/test';

import { CLIENT_FPS, TICK_RATE } from './global';

const randomString = (len: number, an?: string) => {
  an = an && an.toLowerCase();
  var str = "",
    i = 0,
    min = an == "a" ? 10 : 0,
    max = an == "n" ? 10 : 62;
  for (; i++ < len;) {
    var r = Math.random() * (max - min) + min << 0;
    str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
  }
  return str;
}

function createPlayerEntity(socket: Socket): Entity {
  const hero: Entity = new Entity();

  hero
    .addComponent(new VelocityComponent())
    .addComponent(new CollisionComponent({ width: 16, height: 32 }))
    .addComponent(new PositionComponent({ x: 32, y: 32 }))
    .addComponent(new CharacterComponent(io))
    .addComponent(new PlayerComponent(socket));
  ;

  return hero;
}

// Socket.IO server instanciation
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

// Map storing room data for each socket room
const gameRooms: Map<string, GameRoom> = new Map<string, GameRoom>();

io.on('connection', (socket: Socket) => {
  console.log('A user connected !');

  // Socket joins the test room
  socket.join('test');

  // Tell the client to create a player instance
  socket.broadcast.emit('createPlayer');

  // Whenever someone disconnects this piece of code executed
  socket.on('disconnect', () => {
    console.log('A user disconnected!');

    // Tell the client to create a player instance
    socket.broadcast.emit('createPlayer');
  });
});

// On room creation, a few things need to be done
io.of('/').adapter.on('create-room', (room: string) => {
  console.log(`Room "${room}" has been created`);

  // Create new game room
  const gameRoom = new GameRoom({
    map,
  });

  // Add system to game room's world
  gameRoom.world
    .addSystem(new MapSystem());

  // Create map map
  const mapEntity = new Entity();
  mapEntity.addComponent(new MapComponent(map));
  gameRoom.world.addEntity(mapEntity);

  gameRoom.world
    .addSystem(new CollisionSystem())
    .addSystem(new VelocitySystem())
    .addSystem(new PlayerSystem())
    .addSystem(new MapSystem())
    .addSystem(new CharacterSystem())
    .addSystem(new GravitySystem());

  // Start game room gameloop
  gameRoom.gameLoop.setUpdateFunction((delta: number) => {
    // Convert gameloop delta time to super ecs delta time value
    const ECSDeltaTime = 1 * (delta / (1 / TICK_RATE)) * (CLIENT_FPS / TICK_RATE);

    gameRoom.world.update(ECSDeltaTime);
  });

  gameRoom.gameLoop.loop();

  // Create linked game room
  gameRooms.set(room, gameRoom);
});

// ROOM DELETION
io.of('/').adapter.on('delete-room', (room: string) => {
  // TODO: Check if memory leaks?
  gameRooms.delete(room);

  console.log(`Room "${room}" has been deleted`);
});

// ROOM JOIN
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

  console.log(`Socket ${socketId} has joined room "${room}"`);
  console.log(`Room "${room}" now has ${gameRoom.clientsNumber} players`);

  // Client side game init
  socket.emit('gameRoom:init', {
    map: gameRoom.map,
  });

  // Create server-side player ECS entity
  const player = createPlayerEntity(socket);
  gameRoom.world.addEntity(player);

  // Add client to gameroom client list
  gameRoom.clients[randomString(30)] = {
    entity: player
  };

  // Create player for socket
  socket.emit('player:init', {
    players: Object.keys(gameRoom.clients)
  });

  // Create new player for everyone else
  // socket.broadcast.emit('player:join');
});

// Room leave
io.of('/').adapter.on('leave-room', (room, socketId) => {
  // Get gameRoom
  const gameRoom: GameRoom | undefined = gameRooms.get(room);

  // If no gameRoom corresponding to given room name is found, exit event,
  if (gameRoom === undefined) {
    return;
  }

  gameRoom.clientsNumber -= 1;
  console.log(`Socket ${socketId} has left room ${room}`);
  console.log(`Room "${room}" has now ${gameRoom.clientsNumber} players`);
});

const port = process.env.PORT || 5000;
httpServer.listen(port);

// Test gameloop
// const gameLoop = new GameLoop((delta: number, tick: number) => {
//   console.log(delta, tick);
// });
// gameLoop.loop();