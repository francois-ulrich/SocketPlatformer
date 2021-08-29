import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

type CollBoxComponentMetadata = {
  width: number;
  height: number;
};

type CollisionBox = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

class CollBoxComponent implements Component {
  name = COMPONENT_NAMES.CollBox;

  width: number;

  height: number;

  constructor({ width = 16, height = 32 }: CollBoxComponentMetadata) {
    this.width = width;
    this.height = height;
  }

  getRect(x: number, y: number): CollisionBox {
    return {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
    };
  }
}

export default CollBoxComponent;
