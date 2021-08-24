import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class PositionComponent implements Component {
  name = COMPONENT_NAMES.Position;

  x: number;

  y: number;

  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

export default PositionComponent;
