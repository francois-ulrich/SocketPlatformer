import { World } from 'super-ecs';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import SpriteComponent from '../components/SpriteComponent';
import EntityComponent from '../components/EntityComponent';
import CollisionComponent from '../components/CollisionComponent';
import VelocityComponent from '../components/VelocityComponent';
import GravityComponent from '../components/GravityComponent';
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';

class EntitySystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Entity,
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Velocity,
      COMPONENT_NAMES.Gravity,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const entityComponent = entity.getComponent<EntityComponent>(
        COMPONENT_NAMES.Entity,
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

      if (velocityComponent && entityComponent) {
        const { xSpeed } = velocityComponent;
        const { maxXSpeed } = entityComponent;

        // Limit xSpeed
        if (Math.abs(xSpeed) > maxXSpeed) {
          velocityComponent.xSpeed = maxXSpeed * Math.sign(xSpeed);
        }
      }

      // Get map entity
      const mapEntity = this.world.getEntities([
        COMPONENT_NAMES.Map,
      ])[0];

      if (!mapEntity) {
        return;
      }

      // Get map component
      const mapComponent = mapEntity.getComponent<MapComponent>(
        COMPONENT_NAMES.Map,
      );

      if (entityComponent) {
        const { onFloor } = entityComponent;

        // Fall if no floor under entity
        if (
          mapComponent
          && gravityComponent
          && velocityComponent
          && collisionComponent
          && positionComponent
        ) {
          const { bottom, left, right } = collisionComponent.getCollisionBox({
            x: positionComponent.x,
            y: positionComponent.y,
          });

          // Check for floor under entity
          entityComponent.onFloor = mapComponent.getCollision({ x: left, y: bottom }) === 1
            || mapComponent.getCollision({ x: right - 1, y: bottom }) === 1;

          // If not on floor, make the entity fall
          if (!onFloor && !gravityComponent.enabled) {
            gravityComponent.enabled = true;

            if (velocityComponent) {
              if (velocityComponent.ySpeed === 0) {
                velocityComponent.xSpeed = 0;
              }
            }
          }
        }

        // Jump
        if (velocityComponent) {
          // const { xSpeed } = velocityComponent;

          // if (!onFloor && xSpeed != 0) {
          //   velocityComponent.xSpeed += speedIncr * direction;
          // }
        }

        // Sprite update
        if (spriteComponent
          && velocityComponent) {
          switch (entityComponent.state) {
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
                spriteComponent.setScale({ x: Math.sign(entityComponent.direction) });
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
          COMPONENT_NAMES.Entity,
          COMPONENT_NAMES.Sprite,
        ]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        if (spriteComponent && EntityComponent) {
          spriteComponent.setAnimation('idle');
        }
      });
  }
}

export default EntitySystem;
