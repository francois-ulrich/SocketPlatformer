import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class EntityComponent implements Component {
  name = COMPONENT_NAMES.Entity;

  inputRight: boolean;

  inputLeft: boolean;

  maxXSpeed: number;

  onFloor: boolean;

  jumpForce: number;

  state: number;

  constructor() {
    this.state = 0;

    this.inputRight = false;
    this.inputLeft = false;
    this.maxXSpeed = 1;
    this.onFloor = true;
    this.jumpForce = 5;
  }
}

export default EntityComponent;
