import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Entity } from 'super-ecs';

// Other
import GameRoom from '../../shared/src/other/GameRoom';
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
import EntitySystem from './systems/CharacterSystem';
import CollisionSystem from './systems/CollisionSystem';

// Test map
import map from './assets/maps/test';

function createPlayerEntity(): Entity {
  const hero: Entity = new Entity();

  hero
    .addComponent(new VelocityComponent())
    .addComponent(new CollisionComponent({ width: 16, height: 32 }))
    .addComponent(new PositionComponent({ x: 32, y: 32 }))
    .addComponent(new CharacterComponent())
    .addComponent(new PlayerComponent());

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
    .addSystem(new EntitySystem())
    .addSystem(new GravitySystem());

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

  gameRoom.clientsNumber += 1;

  // Get linked socket
  const socket: Socket | undefined = io.sockets.sockets.get(socketId);

  if (socket === undefined) {
    return;
  }

  console.log(`Socket ${socketId} has joined room "${room}"`);
  console.log(`Room "${room}" has now ${gameRoom.clientsNumber} players`);

  // Client side game init
  socket.emit('gameRoom:init', {
    map: gameRoom.map,
  });

  // Create server-side player ECS entity
  createPlayerEntity();

  // Client side player init
  socket.emit('hello');
  socket.emit('player:init');
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
});

const port = process.env.PORT || 5000;
httpServer.listen(port);

// Test gameloop
// const gameLoop = new GameLoop((delta: number, tick: number) => {
// console.log(delta, tick);
// });
// gameLoop.loop();
