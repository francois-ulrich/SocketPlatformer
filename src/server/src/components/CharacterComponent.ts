import { Component } from 'super-ecs';

// import { Socket } from "socket.io";
import { Server } from 'socket.io';

import InputMap from '../types/inputMap';

import COMPONENT_NAMES from './types';

class CharacterComponent implements Component {
  name = COMPONENT_NAMES.Character;

  inputRight: boolean;

  inputLeft: boolean;

  maxXSpeed: number;

  onFloor: boolean;

  jumpForce: number;

  state: number;

  direction: number; // 1: faces right, -1: faces left

  speedIncr: number;

  dirChangeMidAir: boolean;

  input: InputMap;

  inputPressed: InputMap;

  // socket: Socket;

  server: Server;

  // constructor(socket: Socket) {
  constructor(server: Server) {
    this.state = 0;

    this.inputRight = false;
    this.inputLeft = false;
    this.maxXSpeed = 1;
    this.onFloor = true;
    this.jumpForce = 3.9;
    this.direction = 1;
    this.speedIncr = 1;
    this.dirChangeMidAir = true;
    // this.socket = socket;
    this.server = server;

    // Input
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    };

    this.inputPressed = { ...this.input };
  }
}

export default CharacterComponent;
