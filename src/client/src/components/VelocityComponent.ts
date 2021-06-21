import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class VelocityComponent implements Component {
  name = COMPONENT_NAMES.Velocity;

  xSpeed: number;
  ySpeed: number;

  constructor() {
    this.xSpeed = 0;
    this.ySpeed = 0;
  }
}

export default VelocityComponent;
