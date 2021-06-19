import { World } from 'super-ecs';
// import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';

class PositionSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Sprite,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite,
      );

      if (positionComponent && spriteComponent) {
        const { object } = spriteComponent;
        object.position.set(positionComponent.x, positionComponent.y);
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // // Add sprite to stage
    // this.disposeBag
    //   .completable$(
    //     world.entityAdded$([
    //       COMPONENT_NAMES.Position,
    //       COMPONENT_NAMES.Sprite,
    //     ]),
    //   )
    //   .subscribe((entity) => {
    //     const spriteComponent = entity.getComponent<SpriteComponent>(
    //       COMPONENT_NAMES.Sprite,
    //     );

    //     if (spriteComponent) {
    //       // const { sprite } = spriteComponent;
    //       // sprite.Sprite.set(SpriteComponent.x, SpriteComponent.y);

    //     }
    //   });

    // this.disposeBag
    //   .completable$(
    //     world.entityRemoved$([
    //       COMPONENT_NAMES.Position,
    //       COMPONENT_NAMES.Sprite,
    //     ]),
    //   )
    //   .subscribe((entity) => {
    //     const sprite = entity.getComponent(COMPONENT_NAMES.Sprite);

    //     if (sprite) {
    //       this.app.stage.removeChild(sprite.object);
    //     }
    //   });
  }
}

export default PositionSystem;
