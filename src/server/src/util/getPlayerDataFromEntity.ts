import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import CharacterComponent from '../components/CharacterComponent';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';
import SpriteComponent from '../components/SpriteComponent';

// Types
import { PlayerData } from '../types/player';

// Custom types
type SpriteScaleData = {
  x?: number,
  y?: number,
}

type SpriteData = {
  name?: string,
  scale?: SpriteScaleData
}

function getPlayerDataFromEntity(entity: Entity): PlayerData | null {
  const characterComponent = entity.getComponent<CharacterComponent>(
    COMPONENT_NAMES.Character,
  );

  const velocityComponent = entity.getComponent<VelocityComponent>(
    COMPONENT_NAMES.Velocity,
  );

  const positionComponent = entity.getComponent<PositionComponent>(
    COMPONENT_NAMES.Position,
  );

  const playerComponent = entity.getComponent<PlayerComponent>(
    COMPONENT_NAMES.Player,
  );

  const spriteComponent = entity.getComponent<SpriteComponent>(
    COMPONENT_NAMES.Sprite,
  );

  let result: PlayerData | null = null;

  if (
    positionComponent
    && playerComponent
    && velocityComponent
    && characterComponent
    && spriteComponent
  ) {
    const { x, y } = positionComponent;
    const { clientId } = playerComponent;
    const { onFloor } = characterComponent;
    const { spriteName, scale } = spriteComponent;

    result = {
      clientId,
      x,
      y,
    };

    // Sprite name to send to client
    const spriteData: SpriteData = {};
    const newScale: SpriteScaleData = {};

    let newSpriteName: string | null = null;

    if (onFloor) {
      if (Math.abs(velocityComponent.xSpeed) > 0) {
        newSpriteName = 'walk';
        newScale.x = Math.sign(velocityComponent.xSpeed);
      } else {
        newSpriteName = 'idle';
      }
    } else {
      newSpriteName = 'jump';
      newScale.x = Math.sign(characterComponent.direction);
    }

    // Set sprite change
    if (newSpriteName !== spriteName) {
      spriteData.name = newSpriteName;
      spriteComponent.spriteName = newSpriteName;
    }

    // Set scale change
    if (Object.keys(newScale).length > 0) {
      spriteData.scale = { ...newScale };
      if (newScale.x && newScale.x !== scale.x) {
        spriteComponent.scale.x = newScale.x;
      }
      if (newScale.y && newScale.y !== scale.y) {
        spriteComponent.scale.y = newScale.y;
      }
    }

    // If sprite data change, send it to client
    if (Object.keys(spriteData).length > 0) {
      result = { ...result, sprite: spriteData };
    }
  }

  return result;
}

export default getPlayerDataFromEntity;
