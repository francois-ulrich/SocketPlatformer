import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
import CollisionComponent from '../components/CollisionComponent';

class VelocitySystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  update(delta: number): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Velocity,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const collisionComponent = entity.getComponent<CollisionComponent>(
        COMPONENT_NAMES.Position,
      );

      if (positionComponent
        && velocityComponent
        && !collisionComponent) {
        positionComponent.x += velocityComponent.xSpeed * delta;
        positionComponent.y += velocityComponent.ySpeed * delta;
      }
    });
  }
}

export default VelocitySystem;
