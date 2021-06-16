import './style.css';
import * as PIXI from 'pixi.js';
import { World, Entity } from 'super-ecs';
// import { io } from 'socket.io-client';
import PositionSystem from './systems/PositionSystem';
import PositionComponent from './components/PositionComponent';
// import SpriteSystem from './systems/SpriteSystem';
import SpriteComponent from './components/SpriteComponent';
// import COMPONENT_NAMES from './components/types'

import SheetMetadata from './types/spriteMetadata';

// import { data as sheetData } from './assets/sprites/simon/data';
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

// const loader = PIXI.Loader.shared;

// loader
//   .add('sheet/simon', './src/assets/sprites/simon/sheet.png')
//   .load(() => init());

// Temp: add test entity
function createPlayerEntity(): Entity {
  const x = 8;
  const y = 8;

  const hero: Entity = new Entity();

  const sheet: SheetMetadata = spriteData;

  hero
    .addComponent(new PositionComponent({ x, y }))
    .addComponent(new SpriteComponent(sheet));

  return hero;
}

// Init ECS world
function init(): void {
  const world = new World();

  // Instanciate world
  world.addSystem(new PositionSystem({ app }));

  // Instanciate entities
  // entities
  Array.from({ length: 1 }).forEach(() => {
    const entity = createPlayerEntity();
    world.addEntity(entity);
  });

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
