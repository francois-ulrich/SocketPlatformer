import { System } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import SpriteComponent from '../components/SpriteComponent';

class SpriteSystem extends System {
  update(delta: number): void {
    //   update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Sprite]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite,
      );

      if (SpriteComponent) {
        // const { sprite } = spriteComponent;
        // sprite.Sprite.set(SpriteComponent.x, SpriteComponent.y);
      }
    });
  }
}

export default SpriteSystem;
