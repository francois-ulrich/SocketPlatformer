import { World } from 'super-ecs';
// import * as PIXI from 'pixi.js';
import lerp from 'lerp';

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
        const {
          // x, y, xStart, yStart, xEnd, yEnd,
          x, y,
        } = positionComponent;

        // // Lerp position
        // positionComponent.x = lerp(xStart, xEnd, 0);
        // positionComponent.y = lerp(yStart, yEnd, 0);

        // Update sprite position
        if (spriteComponent) {
          const { object } = spriteComponent;
          object.position.set(
            Math.round(positionComponent.x),
            Math.round(positionComponent.y),
          );
        }

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

          object.position.set(
            positionComponent.x,
            positionComponent.y,
          );
        }
      });
  }
}

export default PositionSystem;
