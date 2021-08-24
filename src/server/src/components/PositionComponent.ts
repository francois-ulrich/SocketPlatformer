import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class PositionComponent implements Component {
  name = COMPONENT_NAMES.Position;

  x: number;

  y: number;

  xFraction: number;

  yFraction: number;

  constructor(x:number = 0, y:number = 0) {
    this.x = x;
    this.y = y;
    this.xFraction = 0;
    this.yFraction = 0;
  }

  moveX(val: number): void {
    this.x += val;
  }

  moveY(val: number): void {
    this.y += val;
  }
}

export default PositionComponent;
