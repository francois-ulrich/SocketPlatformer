import { Component } from 'super-ecs';

// import { Socket } from "socket.io";
import { Server } from 'socket.io';

import InputMap from '../types/inputMap';

import COMPONENT_NAMES from './types';

import {
  CHARACTER_MAX_XSPEED,
  CHARACTER_JUMP_FORCE,
  CHARACTER_STAIRS_SPEED,
} from '../global';

class CharacterComponent implements Component {
  name = COMPONENT_NAMES.Character;

  inputRight: boolean;

  inputLeft: boolean;

  maxXSpeed: number;

  stairsSpeed: number;

  onFloor: boolean;

  jumpForce: number;

  state: number;

  direction: number; // 1: faces right, -1: faces left

  speedIncr: number;

  dirChangeMidAir: boolean;

  input: InputMap;

  inputPressed: InputMap;

  server: Server;

  constructor(server: Server) {
    this.server = server;
    this.state = 0;

    this.inputRight = false;
    this.inputLeft = false;
    this.maxXSpeed = CHARACTER_MAX_XSPEED;
    this.stairsSpeed = CHARACTER_STAIRS_SPEED;
    this.onFloor = true;
    this.jumpForce = CHARACTER_JUMP_FORCE;
    this.direction = 1;
    this.speedIncr = 1;
    this.dirChangeMidAir = true;

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
