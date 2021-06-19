import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';
import COMPONENT_NAMES from './types';
import { SpriteMetadata, AnimationMetadata } from '../types/spriteMetadata';

class SpriteComponent implements Component {
  public name = COMPONENT_NAMES.Sprite;

  public sprite: SpriteMetadata;

  public animation: AnimationMetadata;

  public rectangle: PIXI.Rectangle;

  public object: PIXI.Sprite;

  public animationName: string;

  public lastFrameUpdateTime: number;

  public frameTime: number;

  public frame: number;

  public texture: PIXI.Texture;

  constructor(sprite: SpriteMetadata) {
    // Create texture for sprite

    // A Texture stores the information that represents an image.
    // All textures have a base texture, which contains information about the source.
    const texture = PIXI.BaseTexture.from(sprite.sheet);

    // Disable interpolation when scaling, will make texture be pixelated
    texture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Create rectangle
    this.rectangle = new PIXI.Rectangle(0, 0, 16, 32);

    this.texture = new PIXI.Texture(
      texture, // BaseTexture you created
      this.rectangle,
    );

    this.object = new PIXI.Sprite(this.texture);

    this.sprite = sprite;

    this.animation = sprite.animations[sprite.defaultAnimation];

    this.animationName = sprite.defaultAnimation;

    this.lastFrameUpdateTime = Date.now();

    this.frameTime = 0;

    this.frame = 0;
  }

  setFrame(frame: number) {
    this.frame = frame;

    // const newXPos = this.frame * this.animation.width;
    // // console.log(newXPos);

    // this.rectangle.x = newXPos;

    // console.log(this.rectangle.x);

    // this.texture.update();
  }

  setAnimation(animationName: string) {
    // Reset frame
    this.frame = 0;

    this.animationName = animationName;

    this.animation = this.sprite.animations[animationName];

    // Set correct frames
    // Reset x pos
    this.rectangle.x = 0;

    // Set animation y
    this.rectangle.y = this.animation.y;

    this.frameTime = this.animation.frameTime
      ? (this.animation.frameTime / 60) * 1000
      : 0;
  }

  incrementFrame() {
    const frameToSet = (this.frame + 1) % this.animation.frames;

    this.setFrame(frameToSet);
  }
}

export default SpriteComponent;
