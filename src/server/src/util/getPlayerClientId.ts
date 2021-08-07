import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import PlayerComponent from '../components/PlayerComponent';

function getPlayerDataFromEntity(entity: Entity): string | null {
  const playerComponent = entity.getComponent<PlayerComponent>(
    COMPONENT_NAMES.Player,
  );

  // let clientId = null;
  const clientId = playerComponent ? playerComponent.clientId : null;

  return clientId;
}

export default getPlayerDataFromEntity;
