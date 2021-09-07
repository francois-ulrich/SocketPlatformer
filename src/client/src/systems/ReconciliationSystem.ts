import { Entity } from 'super-ecs';

// ECS Components
import COMPONENT_NAMES from '../components/types';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
// import SpriteComponent from '../components/SpriteComponent';
import PlayerComponent from '../components/PlayerComponent';
import CharacterComponent from '../components/CharacterComponent';
// import StairsComponent from '../components/StairsComponent';
import ReconciliationComponent from '../components/ReconciliationComponent';

// Systems
// import PositionSystem from './PositionSystem';
// import VelocitySystem from './VelocitySystem';
// import CharacterSystem from './CharacterSystem';
// import CollisionSystem from './CollisionSystem';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

// Util
// import setPlayerEntityOnStairs from '../util/setPlayerEntityOnStairs';
// import getMapComponent from '../util/getMapComponent';

class ReconciliationSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  update(delta: number): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Reconciliation]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      ReconciliationSystem.updateEntity(entity, delta);
    });
  }

  static updateEntity(entity: Entity, delta: number): void {
    const reconciliationComponent = entity.getComponent<ReconciliationComponent>(
      COMPONENT_NAMES.Reconciliation,
    );

    const playerComponent = entity.getComponent<PlayerComponent>(
      COMPONENT_NAMES.Player,
    );

    const positionComponent = entity.getComponent<PositionComponent>(
      COMPONENT_NAMES.Position,
    );

    const characterComponent = entity.getComponent<CharacterComponent>(
      COMPONENT_NAMES.Character,
    );

    const velocityComponent = entity.getComponent<VelocityComponent>(
      COMPONENT_NAMES.Velocity,
    );

    if (
      reconciliationComponent
      && playerComponent
      && positionComponent
      && characterComponent
      && velocityComponent
    ) {
      const { x, y } = positionComponent;
      const { clientId } = playerComponent;
      const { xSpeed, ySpeed } = velocityComponent;

      // Create result object
      const result = {
        timestamp: new Date().getTime(),
        delta,
        input: { ...playerComponent.input },
        clientId,
        x,
        y,
        xSpeed,
        ySpeed,
      };

      reconciliationComponent.pastStates.push(result);
    }
  }
}

export default ReconciliationSystem;
