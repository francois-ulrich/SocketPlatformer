import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';

type Scale = {
  x: number,
  y: number,
}

class SpriteComponent implements Component {
  name = COMPONENT_NAMES.Sprite;

  spriteName: string | null;

  frame: number;

  frameSpeed: number | null;

  scale: Scale;

  constructor() {
    this.spriteName = null;

    this.scale = {
      x: 1,
      y: 1,
    };

    this.frame = 0;

    this.frameSpeed = 0;
  }
}

export default SpriteComponent;
