import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';
import COMPONENT_NAMES from './types';
import SpriteMetadata from '../types/spriteMetadata';

class SpriteComponent implements Component {
  public name = COMPONENT_NAMES.Sprite;

  public sprite: SpriteMetadata | undefined;

  public rectangle = new PIXI.Rectangle(0, 0, 16, 32);

  public object: PIXI.Sprite;

  public animation: string | undefined;

  constructor(sprite: SpriteMetadata) {
    // Create texture for sprite

    // A Texture stores the information that represents an image.²
    // All textures have a base texture, which contains information about the source.
    const texture = PIXI.BaseTexture.from(sprite.sheet);

    // Disable interpolation when scaling, will make texture be pixelated
    texture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Create rectangle
    this.rectangle = new PIXI.Rectangle(0, 0, 16, 32);

    this.object = new PIXI.Sprite(
      new PIXI.Texture(
        texture, // BaseTexture you created
        this.rectangle,
      ),
    );

    this.sprite = sprite;

    // console.log(this.sheet);
  }

  setAnimation(animation: string) {
    this.animation = animation;
  }
}

export default SpriteComponent;
