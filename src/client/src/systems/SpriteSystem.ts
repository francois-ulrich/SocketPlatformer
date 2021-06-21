import { World } from 'super-ecs';
import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
// import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';

class SpriteSystem extends ExtendedSystem {
  app: PIXI.Application;

  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });

    this.app = app;
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Sprite,
        ]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        if (spriteComponent) {
          this.app.stage.addChild(spriteComponent.object);
          spriteComponent.setAnimation('idle');
        }
      });
  }

  // update(delta: number): void {
  update(): void {
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Sprite,
    ]);
    if (entities.length === 0) {
      return;
    }

    entities.forEach((entity) => {
      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite,
      );

      if (spriteComponent) {
        // const {
        //   animation,
        //   lastFrameUpdateTime,
        //   frameTime,
        // } = spriteComponent;

        // // Update frame
        // if (animation.frameTime) {
        //   const timeSinceLastUpdate: number = Date.now() - lastFrameUpdateTime;

        //   if (timeSinceLastUpdate >= frameTime) {
        //     spriteComponent.incrementFrame();
        //   }
        // }
      }
    });
  }
}

export default SpriteSystem;
