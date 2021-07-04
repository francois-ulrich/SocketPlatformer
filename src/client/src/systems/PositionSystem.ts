import { World } from 'super-ecs';
// import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';
import CollisionComponent from '../components/CollisionComponent';

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

      const collisionComponent = entity.getComponent<CollisionComponent>(
        COMPONENT_NAMES.Collision,
      );

      if (positionComponent) {
        if (spriteComponent) {
          const { object } = spriteComponent;
          object.position.set(positionComponent.x, positionComponent.y);
        }

        const { x, y } = positionComponent;

        if (collisionComponent) {
          // Update debug rectangle position
          collisionComponent.debugRect.x = collisionComponent.getCollisionBox(x, y).left;
          collisionComponent.debugRect.y = collisionComponent.getCollisionBox(x, y).top;
        }
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Position,
          COMPONENT_NAMES.Sprite,
        ]),
      )
      .subscribe((entity) => {
        const positionComponent = entity.getComponent<PositionComponent>(
          COMPONENT_NAMES.Position,
        );

        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        if (spriteComponent && positionComponent) {
          const { object } = spriteComponent;

          object.position.set(positionComponent.x, positionComponent.y);
        }
      });

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
