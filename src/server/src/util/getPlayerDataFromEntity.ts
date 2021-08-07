import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import PlayerComponent from '../components/PlayerComponent';
import PositionComponent from '../components/PositionComponent';

// Types
import { PlayerData } from '../types/player';

function getPlayerDataFromEntity(entity: Entity): PlayerData | null {
  const playerComponent = entity.getComponent<PlayerComponent>(
    COMPONENT_NAMES.Player,
  );

  const positionComponent = entity.getComponent<PositionComponent>(
    COMPONENT_NAMES.Position,
  );

  let result = null;

  if (positionComponent
    && playerComponent) {
    const { x, y } = positionComponent;
    const { clientId } = playerComponent;

    result = {
      clientId,
      x,
      y,
    };
  }

  return result;
}

export default getPlayerDataFromEntity;
