import { World } from 'super-ecs';
import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
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
        }
      });
  }
}

export default SpriteSystem;
