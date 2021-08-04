import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Entity } from 'super-ecs';

// Other
import GameRoom from './other/GameRoom';

// ECS Stuff
import COMPONENT_NAMES from './components/types';

// Component
import PositionComponent from './components/PositionComponent';
import VelocityComponent from './components/VelocityComponent';
import MapComponent from './components/MapComponent';
import CollisionComponent from './components/CollisionComponent';
import PlayerComponent from './components/PlayerComponent';
import CharacterComponent from './components/CharacterComponent';
import GravityComponent from './components/GravityComponent';
import SpriteComponent from './components/SpriteComponent';

// System
import VelocitySystem from './systems/VelocitySystem';
import GravitySystem from './systems/GravitySystem';
import PlayerSystem from './systems/PlayerSystem';
import CharacterSystem from './systems/CharacterSystem';
import CollisionSystem from './systems/CollisionSystem';

// Test map
import map from './assets/maps/test';

import { CLIENT_FPS, TICK_RATE } from './global';

// import { TICK_RATE } from './global';

const randomstring = require('randomstring');


// ======================================================
// ======================================================
// ======================================================

// Socket.IO server instanciation
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

function createPlayerEntity(socket: Socket, clientId: string): Entity {
  const hero: Entity = new Entity();

  hero
    .addComponent(new GravityComponent())
    .addComponent(new CollisionComponent({ width: 16, height: 32 }))
    .addComponent(new VelocityComponent())
    .addComponent(new PositionComponent({ x: 0, y: 0 }))
    .addComponent(new CharacterComponent(io))
    .addComponent(new SpriteComponent())
    .addComponent(new PlayerComponent(socket, clientId));

  return hero;
}

type PlayersList = {
  [key: string]: PlayerData
}

type PlayerData = null | {
  clientId: string,
  x: number,
  y: number
}

function getPlayerDataFromEntity(entity: Entity): PlayerData {
  const playerComponent = entity.getComponent<PlayerComponent>(
    COMPONENT_NAMES.Player,
  );

  const positionComponent = entity.getComponent<PositionComponent>(
    COMPONENT_NAMES.Position,
  );

  let result = null;

  if (positionComponent
    && playerComponent) {
    const { x, y } = positionComponent;
    const { clientId } = playerComponent;

    result = {
      x,
      y,
      clientId,
    }
  }

  return result;
}

// function sendPlayerData(): void {
//   io.sockets.emit("")
// }

// ======================================================
// ======================================================
// ======================================================


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
  console.log(`Create room: "${room}"`);

  // Create new game room
  const gameRoom = new GameRoom({
    map,
  });

  // Create linked game room
  gameRooms.set(room, gameRoom);

  gameRoom.world
    .addSystem(new PlayerSystem())
    .addSystem(new CharacterSystem())
    .addSystem(new GravitySystem())
    .addSystem(new CollisionSystem())
    .addSystem(new VelocitySystem())
    ;

  // Add system to game room's world
  const mapEntity = new Entity();
  mapEntity.addComponent(new MapComponent(map));
  gameRoom.world.addEntity(mapEntity);

  // Start game room gameloop
  gameRoom.gameLoop.setUpdateFunction((delta: number) => {
    // Convert gameloop delta time to super ecs delta time value
    const ecsDeltaTime = ((delta / (1 / TICK_RATE)) * (CLIENT_FPS / TICK_RATE));

    gameRoom.world.update(ecsDeltaTime);
  });

  // Launch loop
  gameRoom.gameLoop.loop();

  gameRooms.set(room, gameRoom);

  console.log(`Room "${room}" has been created`);
});

// ROOM DELETION
io.of('/').adapter.on('delete-room', (room: string) => {
  // TODO: Check if memory leaks?
  gameRooms.delete(room);

  console.log(`Room "${room}" has been deleted`);
});

// ROOM JOIN
io.of('/').adapter.on('join-room', (room, socketId) => {
  // If the room is the socket's own default room, don't do anything
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

  // Client side game init
  socket.emit('gameRoom:init', {
    map: gameRoom.map,
  });

  // Add client to gameroom client list
  const newClientId = randomstring.generate();

  // Create server-side player ECS entity
  const player = createPlayerEntity(socket, newClientId);
  gameRoom.world.addEntity(player);

  gameRoom.clients[newClientId] = {
    entity: player,
  };

  const players: PlayersList = {}

  for (const clientId of Object.keys(gameRoom.clients)) {
    const playerEntity = gameRoom.clients[clientId].entity;

    players[clientId] = getPlayerDataFromEntity(playerEntity);
  }

  // Create player for socket
  socket.emit('players:init', {
    newClientId,
    players,
  });
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
