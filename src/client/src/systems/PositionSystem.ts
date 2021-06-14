import { System, World } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';

class PositionSystem extends System {
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
        COMPONENT_NAMES.Position
      );

      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite
      );

      if (positionComponent && spriteComponent) {
        const { sprite } = spriteComponent;
        sprite.position.set(positionComponent.x, positionComponent.y);
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
  }
}

export default PositionSystem;