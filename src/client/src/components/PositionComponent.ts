import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

import { PositionMetadata } from '../types/positionMetadata';

class PositionComponent implements Component {
  name = COMPONENT_NAMES.Position;

  x: number;

  y: number;

  xFraction: number;

  yFraction: number;

  // TODO: Utiliser des objets en tant qu'arguments pour la création des components?
  constructor({ x = 0, y = 0 }: PositionMetadata) {
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
