import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import GravityComponent from '../components/GravityComponent';
import VelocityComponent from '../components/VelocityComponent';

class GravitySystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Gravity,
      COMPONENT_NAMES.Velocity,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const gravityComponent = entity.getComponent<GravityComponent>(
        COMPONENT_NAMES.Gravity,
      );

      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      if (gravityComponent && velocityComponent) {
        if (gravityComponent.enabled) {
          velocityComponent.ySpeed += gravityComponent.force;
        }
      }
    });
  }
}

export default GravitySystem;
