import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';
import COMPONENT_NAMES from './types';

type SpriteMetadata = {
  filePath: string;
}

class SpriteComponent implements Component {
  name = COMPONENT_NAMES.Sprite;

  object: PIXI.Sprite;

  constructor({ filePath }: SpriteMetadata) {
    this.object = PIXI.Sprite.from(filePath);
  }
}

export default SpriteComponent;
