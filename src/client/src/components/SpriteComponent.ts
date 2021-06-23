import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';
import COMPONENT_NAMES from './types';
import { SpriteMetadata } from '../types/spriteMetadata';

type SheetMetadata = {
  [index: string]: Array<PIXI.Texture>,
}

type setScaleMetadata = {
  x?: number | null,
  y?: number | null,
}

class SpriteComponent implements Component {
  public name = COMPONENT_NAMES.Sprite;

  public sprite: SpriteMetadata;

  public sheetBaseTexture: PIXI.BaseTexture;

  public object: PIXI.AnimatedSprite;

  public frame: number;

  public sheet: SheetMetadata;

  public currentAnimationName: string;

  constructor(sprite: SpriteMetadata) {
    this.sprite = sprite;

    // Create texture for sprite

    // A Texture stores the information that represents an image.
    // All textures have a base texture, which contains information about the source.
    this.sheetBaseTexture = PIXI.BaseTexture.from(this.sprite.src);

    // Disable interpolation when scaling, will make texture be pixelated
    this.frame = 0;

    this.sheet = {};

    // Init sheet
    for (const animName in this.sprite.animations) {
      const currentAnim = this.sprite.animations[animName];

      const newAnimation = [];

      for (let i = 0; i < currentAnim.frames; i++) {
        const frameX = i * currentAnim.width;

        newAnimation.push(new PIXI.Texture(this.sheetBaseTexture, new PIXI.Rectangle(frameX, currentAnim.y, currentAnim.width, currentAnim.height)));
      }

      this.sheet[animName] = newAnimation;
    }

    this.object = new PIXI.AnimatedSprite(this.sheet.idle);

    this.currentAnimationName = "idle";
  }

  setAnimation(animationName: string) {
    // Update sprite anchor point
    this.object.anchor.set(0.5, 0.5);

    if (this.currentAnimationName != animationName) {
      this.currentAnimationName = animationName

      this.object.textures = this.sheet[animationName];

      const animSpeed = this.sprite.animations[animationName].frameTime;

      this.object.animationSpeed = animSpeed || 1;
      this.object.play();
    }
  }

  setScale({ x = null, y = null }: setScaleMetadata) {
    if (x) {
      this.object.scale.x = x;
    }

    if (y) {
      this.object.scale.y = y;
    }
  }
}

export default SpriteComponent;
