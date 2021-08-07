import { Entity, World } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import PlayerComponent from '../components/PlayerComponent';

function getPlayerEntityFromClientId(world: World, clientId: string): Entity | null {
  // Get player entities
  const entities = world.getEntities([
    COMPONENT_NAMES.Player,
  ]);

  // Loop through entities to find player entity
  for (let i: number = 0; i < entities.length; i += 1) {
    const entity = entities[i];

    // console.log(entity);

    const playerComponent = entity.getComponent<PlayerComponent>(
      COMPONENT_NAMES.Player,
    );

    if (playerComponent) {
      if (playerComponent.clientId === clientId) {
        return entity;
      }
    }
  }

  return null;
}

export default getPlayerEntityFromClientId;
