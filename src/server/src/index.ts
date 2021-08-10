import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from './components/types';

// ECS Component
import PositionComponent from './components/PositionComponent';
import VelocityComponent from './components/VelocityComponent';
import MapComponent from './components/MapComponent';
import CollisionComponent from './components/CollisionComponent';
import PlayerComponent from './components/PlayerComponent';
import CharacterComponent from './components/CharacterComponent';
import GravityComponent from './components/GravityComponent';
import SpriteComponent from './components/SpriteComponent';
import UpdateComponent from './components/UpdateComponent';

// ECS System
import VelocitySystem from './systems/VelocitySystem';
import GravitySystem from './systems/GravitySystem';
import PlayerSystem from './systems/PlayerSystem';
import CharacterSystem from './systems/CharacterSystem';
import CollisionSystem from './systems/CollisionSystem';
import UpdateSystem from './systems/UpdateSystem';

// Types
import { PlayersList } from './types/player';

// Util
import getPlayerDataFromEntity from './util/getPlayerDataFromEntity';

// Other
import GameRoom from './other/GameRoom';

// Map
import map from './assets/maps/test2';

import { CLIENT_FPS, TICK_RATE } from './global';

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

function createPlayerEntity(socket: Socket,
  clientId: string,
  roomName: string): Entity {
  const hero: Entity = new Entity();

  hero
    .addComponent(new GravityComponent())
    .addComponent(new CollisionComponent({ width: 16, height: 32 }))
    .addComponent(new VelocityComponent())
    .addComponent(new PositionComponent({ x: 0, y: 0 }))
    .addComponent(new CharacterComponent(io))
    .addComponent(new SpriteComponent())
    .addComponent(new PlayerComponent(socket, clientId, roomName));

  return hero;
}

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

  const roomName = 'test';

  // Create new game room
  const gameRoom = new GameRoom({
    map,
    name: roomName,
  });

  // Create linked game room
  gameRooms.set(room, gameRoom);

  gameRoom.world
    .addSystem(new PlayerSystem())
    .addSystem(new CharacterSystem())
    .addSystem(new GravitySystem())
    .addSystem(new CollisionSystem())
    .addSystem(new VelocitySystem())
    .addSystem(new UpdateSystem())
    ;

  // Add system to game room's world
  const roomEntity = new Entity();
  roomEntity.addComponent(new MapComponent(map));
  roomEntity.addComponent(new UpdateComponent(io, roomName));
  gameRoom.world.addEntity(roomEntity);

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
  const player = createPlayerEntity(socket, newClientId, gameRoom.name);
  gameRoom.world.addEntity(player);

  gameRoom.clients[newClientId] = {
    entity: player,
  };

  const players: PlayersList = {};

  Object.keys(gameRoom.clients).forEach((clientId) => {
    const playerEntity = gameRoom.clients[clientId].entity;

    const playerData = getPlayerDataFromEntity(playerEntity);

    if (playerData) {
      players[clientId] = playerData;
    }
  });

  // Send player and other players data to client
  socket.emit('players:init', {
    clientId: newClientId,
    players,
  });

  socket.broadcast.emit('player:add', players[newClientId]);

  // Increment client number
  gameRoom.clientsNumber += 1;
});

// Room leave
io.of('/').adapter.on('leave-room', (room, socketId) => {
  // Get gameRoom
  const gameRoom: GameRoom | undefined = gameRooms.get(room);

  // If no gameRoom corresponding to given room name is found, exit event,
  if (gameRoom === undefined) {
    return;
  }

  // Remove player entity from world

  // Get player entities
  const playerEntities = gameRoom.world.getEntities([COMPONENT_NAMES.Player]);

  for (let i = 0; i < playerEntities.length; i += 1) {
    const entity = playerEntities[i];

    const playerComponent = entity.getComponent<PlayerComponent>(COMPONENT_NAMES.Player);

    if (playerComponent) {
      const { socket, clientId } = playerComponent;

      if (socket.id === socketId) {
        console.log(`Socket ${socketId} leaves room ${gameRoom.name}`);

        io.in(gameRoom.name).emit('player:delete', {
          clientId,
        });

        break;
      }
    }
  }

  // Decrement client number
  gameRoom.clientsNumber -= 1;

  console.log(`Room "${room}" has now ${gameRoom.clientsNumber} players`);
});

const port = process.env.PORT || 5000;
httpServer.listen(port);