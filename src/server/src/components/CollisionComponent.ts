import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

type CollisionComponentMetadata = {
  width: number;
  height: number;
}

type CollisionBox = {
  top: number,
  bottom: number,
  left: number,
  right: number,
}

class CollisionComponent implements Component {
  name = COMPONENT_NAMES.Collision;

  width: number;

  height: number;

  constructor({ width = 16, height = 32 }: CollisionComponentMetadata) {
    this.width = width;
    this.height = height;
  }

  getCollisionBox(x: number, y: number): CollisionBox {
    return {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
    };
  }
}

export default CollisionComponent;
