import './style.css';
import * as PIXI from 'pixi.js';
import { World, Entity } from 'super-ecs';
// import { io } from 'socket.io-client';

import PositionComponent from './components/PositionComponent';
import SpriteComponent from './components/SpriteComponent';
import VelocityComponent from './components/VelocityComponent';
import GravityComponent from './components/GravityComponent';
import MapComponent from './components/MapComponent';
import CollisionComponent from './components/CollisionComponent';
import PlayerComponent from './components/PlayerComponent';
// import EntityComponent from './components/EntityComponent';

import SpriteSystem from './systems/SpriteSystem';
import PositionSystem from './systems/PositionSystem';
import VelocitySystem from './systems/VelocitySystem';
import GravitySystem from './systems/GravitySystem';
import MapSystem from './systems/MapSystem';
import PlayerSystem from './systems/PlayerSystem';
import EntitySystem from './systems/EntitySystem';

import { SpriteMetadata } from './types/spriteMetadata';

import spriteData from './assets/sprites/simon/data';

// Test map
import map from './assets/maps/test';

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

// Temp: add test entity
function createPlayerEntity(): Entity {
  const hero: Entity = new Entity();

  const sprite: SpriteMetadata = spriteData;

  hero
    .addComponent(new PositionComponent({ x: 16, y: 16 }))
    .addComponent(new SpriteComponent(sprite))
    .addComponent(new VelocityComponent())
    .addComponent(new GravityComponent())
    .addComponent(new CollisionComponent({ width: 16, height: 32 }))
    .addComponent(new PlayerComponent());

  return hero;
}

// Map instanciation

function init(): void {
  app.stage.scale.x = 2;
  app.stage.scale.y = 2;

  // Disable interpolation when scaling, will make texture be pixelated
  PIXI.settings.RESOLUTION = window.devicePixelRatio;
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  PIXI.settings.RENDER_OPTIONS.antialias = true; // Enable antialiasing

  // Init ECS World
  const world = new World();

  // Instanciate world
  world.addSystem(new GravitySystem({ app }))
    .addSystem(new VelocitySystem({ app }))
    .addSystem(new PositionSystem({ app }))
    .addSystem(new SpriteSystem({ app }))
    .addSystem(new MapSystem({ app }))
    .addSystem(new EntitySystem({ app }))
    .addSystem(new PlayerSystem({ app }));

  // Instanciate entities
  // entities
  Array.from({ length: 1 }).forEach(() => {
    const entity = createPlayerEntity();
    world.addEntity(entity);
  });

  // Create map
  const testMap = new Entity();
  testMap.addComponent(new MapComponent({ collision: map }));
  world.addEntity(testMap);

  // Add systems to world
  app.ticker.add((deltaTime) => world.update(deltaTime));
}

init();


// // Socket stuff
// const socket = io('ws://localhost:5000/');

// socket.on('connect', () => {
//   socket.on('test', (data) => {
//     console.log(data);
//   });
// });

// Test ECS
