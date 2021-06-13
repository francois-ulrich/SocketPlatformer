import { System } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';

class PositionSystem extends System {
  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Position,
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

      if (positionComponent) {
        // const { sprite } = spriteComponent;
        // sprite.position.set(positionComponent.x, positionComponent.y);
      }
    });
  }
}

export default PositionSystem;
