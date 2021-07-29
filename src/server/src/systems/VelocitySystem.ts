import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
// import { TILE_SIZE } from '../global';

class VelocitySystem extends ExtendedSystem {
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

      if (positionComponent
        && velocityComponent) {
        positionComponent.moveX(velocityComponent.xSpeed * delta);
        positionComponent.moveY(velocityComponent.ySpeed * delta);

        // positionComponent.x += Math.min(velocityComponent.xSpeed * delta, TILE_SIZE);
        // positionComponent.y += Math.min(
        //   velocityComponent.ySpeed * delta,
        //   TILE_SIZE,
        // );
      }
    });
  }
}

export default VelocitySystem;
