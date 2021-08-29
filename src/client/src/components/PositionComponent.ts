import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class PositionComponent implements Component {
  name = COMPONENT_NAMES.Position;

  x: number;

  y: number;

  xStart: number;

  yStart: number;

  xEnd: number;

  yEnd: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.xStart = x;
    this.yStart = y;
    this.xEnd = x;
    this.yEnd = y;
  }
}

export default PositionComponent;
