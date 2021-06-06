import './style.css';
import * as PIXI from 'pixi.js';

// ES6 import or TypeScript
import { io } from 'socket.io-client';

// Create a Pixi Application
const app = new PIXI.Application({
  antialias: true,
  backgroundColor: 0xbababa,
});

// Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

// Socket stuff
const socket = io('http://localhost:3001/');

socket.on('connect', () => {
});
