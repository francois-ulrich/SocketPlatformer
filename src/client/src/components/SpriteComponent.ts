import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';
import COMPONENT_NAMES from './types';

type SpriteMetadata = {
  fileSrc: string;
}

class SpriteComponent implements Component {
  public name = COMPONENT_NAMES.Sprite;

  public object: PIXI.Sprite;

  constructor({ fileSrc = '' }: SpriteMetadata) {
    // Create texture for sprite

    // A Texture stores the information that represents an image.
    // All textures have a base texture, which contains information about the source.
    const texture = PIXI.BaseTexture.from(fileSrc);
    // Disable interpolation when scaling, will make texture be pixelated
    texture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    this.object = new PIXI.Sprite(
      new PIXI.Texture(
        texture, // BaseTexture you created
        new PIXI.Rectangle(0, 0, 16, 32), // Rectangle object is an area defined by its position,
        // as indicated by its top - left corner point(x, y)
        // and by its width and its height.
      ),
    );
  }
}

export default SpriteComponent;
