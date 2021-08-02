import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';

type Scale = {
  x: number,
  y: number,
}

class SpriteComponent implements Component {
  public name = COMPONENT_NAMES.Sprite;

  spriteName: string | null;

  scale: Scale;

  constructor() {
    this.spriteName = null;

    this.scale = {
      x: 1,
      y: 1,
    };
  }
}

export default SpriteComponent;
