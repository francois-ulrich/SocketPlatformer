import { Component } from 'super-ecs';


import COMPONENT_NAMES from './types';

class EntityComponent implements Component {
  name = COMPONENT_NAMES.Entity;

  inputRight: boolean;

  inputLeft: boolean;

  maxXSpeed: number;

  constructor() {
    this.inputRight = false;
    this.inputLeft = false;
    this.maxXSpeed = 1;
  }
}

export default EntityComponent;
