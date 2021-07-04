import { World } from 'super-ecs';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import SpriteComponent from '../components/SpriteComponent';
import CharacterComponent from '../components/CharacterComponent';
import CollisionComponent from '../components/CollisionComponent';
import VelocityComponent from '../components/VelocityComponent';
import GravityComponent from '../components/GravityComponent';
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';

class CharacterSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Character,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
      );

      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite,
      );

      const collisionComponent = entity.getComponent<CollisionComponent>(
        COMPONENT_NAMES.Collision,
      );

      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const gravityComponent = entity.getComponent<GravityComponent>(
        COMPONENT_NAMES.Gravity,
      );

      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      // Get map entity
      const [mapEntity] = this.world.getEntities([
        COMPONENT_NAMES.Map,
      ]);

      if (!mapEntity) {
        return;
      }

      // Get map component
      const mapComponent = mapEntity.getComponent<MapComponent>(
        COMPONENT_NAMES.Map,
      );

      // console.log(characterComponent);
      // console.log(velocityComponent);

      if (characterComponent) {
        if (velocityComponent) {
          const { xSpeed } = velocityComponent;
          const { maxXSpeed } = characterComponent;

          // Limit xSpeed
          if (Math.abs(xSpeed) > maxXSpeed) {
            velocityComponent.xSpeed = maxXSpeed * Math.sign(xSpeed);
          }
        }

        const { onFloor } = characterComponent;

        // Fall if no floor under entity
        if (
          mapComponent
          // && gravityComponent
          && velocityComponent
          && collisionComponent
          && positionComponent
        ) {
          const {
            bottom,
            left,
            right,
          } = collisionComponent.getCollisionBox(positionComponent.x, positionComponent.y);

          // Check for floor under entity
          characterComponent.onFloor = mapComponent.getCollision(left, bottom) === 1
            || mapComponent.getCollision(right - 1, bottom) === 1;

          // If not on floor, make the entity fall
          if (!characterComponent.onFloor && !gravityComponent) {
            entity.addComponent(new GravityComponent());
          }

          if (characterComponent.onFloor && gravityComponent) {
            entity.removeComponent(COMPONENT_NAMES.Gravity);
          }
        }

        // Sprite update
        if (spriteComponent
          && velocityComponent) {
          switch (characterComponent.state) {
            default:
              if (onFloor) {
                if (Math.abs(velocityComponent.xSpeed) > 0) {
                  spriteComponent.setAnimation('walk');
                  spriteComponent.setScale({ x: Math.sign(velocityComponent.xSpeed) });
                } else {
                  spriteComponent.setAnimation('idle');
                }
              } else {
                spriteComponent.setAnimation('jump');
                spriteComponent.setScale({ x: Math.sign(characterComponent.direction) });
              }

              break;
          }
        }
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Character,
          COMPONENT_NAMES.Sprite,
        ]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        const characterComponent = entity.getComponent<CharacterComponent>(
          COMPONENT_NAMES.Character,
        );

        if (spriteComponent && characterComponent) {
          spriteComponent.setAnimation('idle');
        }
      });
  }
}

export default CharacterSystem;
