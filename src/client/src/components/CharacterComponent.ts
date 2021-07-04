import { Component } from 'super-ecs';

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

  constructor() {
    this.state = 0;

    this.inputRight = false;
    this.inputLeft = false;
    this.maxXSpeed = 1;
    this.onFloor = true;
    this.jumpForce = 3.8;
    this.direction = 1;
    this.speedIncr = 0.2;
    this.dirChangeMidAir = true;
  }
}

export default CharacterComponent;
