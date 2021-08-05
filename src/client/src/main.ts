import './style.css';
import * as PIXI from 'pixi.js';
import { World, Entity } from 'super-ecs';
import { io, Socket } from 'socket.io-client';

// ECS Stuff
import COMPONENT_NAMES from './components/types';

// Component
import PositionComponent from './components/PositionComponent';
import SpriteComponent from './components/SpriteComponent';
import VelocityComponent from './components/VelocityComponent';
import MapComponent from './components/MapComponent';
// import CollisionComponent from './components/CollisionComponent';
import PlayerComponent from './components/PlayerComponent';
import CharacterComponent from './components/CharacterComponent';

// System
import SpriteSystem from './systems/SpriteSystem';
import PositionSystem from './systems/PositionSystem';
import VelocitySystem from './systems/VelocitySystem';
import MapSystem from './systems/MapSystem';
import PlayerSystem from './systems/PlayerSystem';
import CharacterSystem from './systems/CharacterSystem';
// import CollisionSystem from './systems/CollisionSystem';

// Types
import { SpriteMetadata } from './types/spriteMetadata';
import { MapMetadata } from '../../shared/src/types/mapMetadata';
import GameRoomMetadata from '../../shared/src/types/gameRoomMetadata';
import { PlayerData } from '../../server/src/types/player';

import spriteData from './assets/sprites/simon/data';

// Create a Pixi Application
const app = new PIXI.Application({
  antialias: true,
  backgroundColor: 0xbababa,
  resizeTo: window,
  resolution: 1,
});

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Add container to stage
const container = new PIXI.Container();
app.stage.addChild(container);

// Rescale PIXI stage
const stageScale: number = 1;
app.stage.scale.x = stageScale;
app.stage.scale.y = stageScale;

// Disable interpolation when scaling, will make texture be pixelated
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = true; // Enable antialiasing

// Temp: add test entity
function createPlayerEntity(data: PlayerData): Entity {
  const { x, y } = data;

  const playerEntity: Entity = new Entity();
  const sprite: SpriteMetadata = spriteData;

  playerEntity
    .addComponent(new VelocityComponent())
    .addComponent(new PositionComponent({ x, y }))
    .addComponent(new CharacterComponent())
    .addComponent(new SpriteComponent(sprite));

  return playerEntity;
}

// Add systems to world
// Client initialization

// Init ECS World
let world: World;

// Socket stuff
const socket = io('ws://localhost:5000/');

socket.on('connect', () => {
  // Make player automatically join the test room
  socket.emit('join', 'test');

  // =============
  socket.on('players:init', (data) => {
    console.log('Init player');

    const { clientId, players } = data;

    // Add all entities
    Object.entries(players).forEach(([id, playerData]) => {
      console.log(id, playerData);

      const newPlayerEntity = createPlayerEntity(playerData);

      // Add player component on client's player 
      if (id === clientId) {
        newPlayerEntity.addComponent(new PlayerComponent(clientId, socket));
      }

      world.addEntity(newPlayerEntity);
    });
  });

  socket.on('player:add', (data) => {
    const { clientId } = data;

    const newPlayerEntity = createPlayerEntity(data);
    newPlayerEntity.addComponent(new PlayerComponent(clientId));
    world.addEntity(newPlayerEntity);
  });

  socket.on('players:update', (data) => {
    console.log(data);
  });

  socket.on('player:delete', (data) => {
    const { clientId } = data;

    // Find entity to delete
    const playerEntities = world.getEntities([COMPONENT_NAMES.Player]);

    for (let i = 0; i < playerEntities.length; i += 1) {
      const entity = playerEntities[i];

      const playerComponent = entity.getComponent<PlayerComponent>(COMPONENT_NAMES.Player);

      if (playerComponent && clientId === playerComponent.clientId) {
        world.removeEntity(entity);
      }
    }
  });

  socket.on('gameRoom:init', (data: GameRoomMetadata) => {
    console.log('Initializing client game room...');

    // Map instanciation
    world = new World();

    // Instanciate world
    world
      // .addSystem(new CollisionSystem({ app }))
      .addSystem(new VelocitySystem({ app }))
      .addSystem(new PositionSystem({ app }))
      .addSystem(new MapSystem({ app }))
      .addSystem(new CharacterSystem({ app }))
      .addSystem(new SpriteSystem({ app }))
      .addSystem(new PlayerSystem({ app }))
      ;

    // Initialize map
    const mapData: MapMetadata = data.map;

    const mapEntity: Entity = new Entity();
    mapEntity.addComponent(new MapComponent(mapData));
    world.addEntity(mapEntity);

    // Start world
    app.ticker.add((deltaTime) => world.update(deltaTime));
  });
});
