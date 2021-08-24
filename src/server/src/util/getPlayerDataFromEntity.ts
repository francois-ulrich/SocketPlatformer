import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import CharacterComponent from '../components/CharacterComponent';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';
import SpriteComponent from '../components/SpriteComponent';
import StairsComponent from '../components/StairsComponent';

// Types
import { PlayerData } from '../types/player';

// Custom types
type SpriteScaleData = {
  x?: number,
  y?: number,
}

type SpriteData = {
  name?: string,
  scale?: SpriteScaleData,
  frameSpeed?: number | null
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

  const stairsComponent = entity.getComponent<StairsComponent>(
    COMPONENT_NAMES.Stairs,
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
    const { onFloor, direction } = characterComponent;
    const { spriteName, scale, frameSpeed } = spriteComponent;
    const { xSpeed } = velocityComponent;

    result = {
      clientId,
      x,
      y,
    };

    // Sprite name to send to client
    const spriteData: SpriteData = {};
    const newScale: SpriteScaleData = {};

    let newSpriteName: string | undefined;
    let newFrameSpeed: number | undefined | null;

    if (stairsComponent) {
      // Sprite if on stairs
      const { stairType } = stairsComponent;
      newSpriteName = (stairType === direction) ? 'stairsAsc' : 'stairsDesc';

      newScale.x = Math.sign(velocityComponent.xSpeed);
      newFrameSpeed = Math.abs(xSpeed) > 0 ? 0.1 : 0;
    } else if (onFloor) {
      // Sprites when on floor
      if (Math.abs(velocityComponent.xSpeed) > 0) {
        newSpriteName = 'walk';
        newFrameSpeed = 0.15;
        newScale.x = Math.sign(velocityComponent.xSpeed);
      } else {
        newSpriteName = 'idle';
      }
    } else {
      // Sprite when jumping
      newSpriteName = 'jump';
      newScale.x = Math.sign(characterComponent.direction);
    }

    // Set sprite change
    if (newSpriteName !== undefined && newSpriteName !== spriteName) {
      spriteData.name = newSpriteName;
      spriteComponent.spriteName = newSpriteName;
    }

    // Set frame speed change
    if (newFrameSpeed !== undefined && newFrameSpeed !== frameSpeed) {
      spriteData.frameSpeed = newFrameSpeed;
      spriteComponent.frameSpeed = newFrameSpeed;
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
