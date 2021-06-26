import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

type PositionMetadata = {
  x: number;
  y: number;
}

class PositionComponent implements Component {
  name = COMPONENT_NAMES.Position;

  x: number;

  y: number;

  constructor({ x = 0, y = 0 }: PositionMetadata) {
    this.x = x;
    this.y = y;
  }
}

export default PositionComponent;
