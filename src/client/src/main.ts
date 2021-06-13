import './style.css';
import * as PIXI from 'pixi.js';
import { World, Entity } from 'super-ecs';
// import { io } from 'socket.io-client';
import PositionSystem from './systems/PositionSystem';
import PositionComponent from './components/PositionComponent';
import SpriteSystem from './systems/SpriteSystem';
import SpriteComponent from './components/SpriteComponent';

// Create a Pixi Application
const app = new PIXI.Application({
  antialias: true,
  backgroundColor: 0xbababa,
  resizeTo: window,
});

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Add container to stage
const container = new PIXI.Container();
app.stage.addChild(container);

function createPlayerEntity(): Entity {
  const x = Math.floor(Math.random() * 600);
  const y = Math.floor(Math.random() * 400);

  const hero = new Entity();

  const spriteSheetPath = './assets/sprites/simon/sheet.png';

  hero
    .addComponent(new PositionComponent({ x, y }))
    .addComponent(new SpriteComponent({ spriteSheetPath }));

  return hero;
}

// Init ECS world
function init(): void {
  const world = new World();

  // Instanciate world
  world.addSystem(new PositionSystem());
  world.addSystem(new SpriteSystem());

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
