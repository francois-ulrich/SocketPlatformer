import { World } from 'super-ecs';

import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';
import CollisionComponent from '../components/CollisionComponent';
import SpriteComponent from '../components/SpriteComponent';

// TODO: see what's wrong with warning messages
class PositionSystem extends ExtendedSystem {
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
          object.position.set(
            Math.round(positionComponent.x),
            Math.round(positionComponent.y),
          );
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

          object.position.set(
            Math.round(positionComponent.x),
            Math.round(positionComponent.y),
          );
        }
      });
  }
}

export default PositionSystem;
