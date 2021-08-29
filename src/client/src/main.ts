import './style.css';
import * as PIXI from 'pixi.js';
import { World, Entity } from 'super-ecs';
import { io, Socket } from 'socket.io-client';

// Component
import MapComponent from './components/MapComponent';

// ECS System
import SpriteSystem from './systems/SpriteSystem';
import PositionSystem from './systems/PositionSystem';
import MapSystem from './systems/MapSystem';
import PlayerSystem from './systems/PlayerSystem';
import CharacterSystem from './systems/CharacterSystem';
import VelocitySystem from './systems/VelocitySystem';
import StairsSystem from './systems/StairsSystem';

// Types
import { MapMetadata } from '../../server/src/types/mapMetadata';

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
const stageScale: number = 2;
app.stage.scale.x = stageScale;
app.stage.scale.y = stageScale;

// Disable interpolation when scaling, will make texture be pixelated
PIXI.settings.RESOLUTION = window.devicePixelRatio;
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.RENDER_OPTIONS.antialias = true; // Enable antialiasing

// Add systems to world
// Client initialization

// Socket stuff
const socket: Socket = io('ws://localhost:5000/');

// Instanciate ECS World
socket.on('gameRoom:init', (data: MapMetadata) => {
  console.log('Initializing client game room...');

  // Map instanciation
  const world = new World();

  // Instanciate world
  world
    .addSystem(new PositionSystem({ app })) // TODO: change argument from object to app instance
    .addSystem(new VelocitySystem({ app }))
    .addSystem(new StairsSystem({ app }))
    .addSystem(new MapSystem({ app }))
    .addSystem(new CharacterSystem({ app }))
    .addSystem(new SpriteSystem({ app }))
    .addSystem(new PlayerSystem({ app, socket, world }));

  // Initialize map
  const mapData: MapMetadata = data;

  const mapEntity: Entity = new Entity();
  mapEntity.addComponent(new MapComponent(mapData));
  world.addEntity(mapEntity);

  // Start world
  app.ticker.add((deltaTime) => world.update(deltaTime));
});
