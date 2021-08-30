// import {World} from 'super-ecs'

import COMPONENT_NAMES from '../components/types';

import MapComponent from '../components/MapComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollBoxComponent from '../components/CollBoxComponent';
import PositionComponent from '../components/PositionComponent';
import CharacterComponent from '../components/CharacterComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

// Types
import { PositionMetadata } from '../../../server/src/types/positionMetadata';

import { TILE_SIZE } from '../global';

class CollisionSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }
  update(delta: number): void {
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Velocity,
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Collision,
      COMPONENT_NAMES.CollBox,
    ]);

    // Loop through all entities
    entities.forEach((entity) => {
      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const collBoxComponent = entity.getComponent<CollBoxComponent>(
        COMPONENT_NAMES.CollBox,
      );

      const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
      );

      // Collision checking

      // Get map entity
      const mapEntity = this.world.getEntities([COMPONENT_NAMES.Map])[0];

      if (!mapEntity) {
        return;
      }

      // Get map component
      const mapComponent = mapEntity.getComponent<MapComponent>(
        COMPONENT_NAMES.Map,
      );

      if (
        mapComponent
        && positionComponent
        && collBoxComponent
        && velocityComponent
      ) {
        const { width, height } = collBoxComponent;

        const { xSpeed, ySpeed } = velocityComponent;


        let collisionBox = collBoxComponent.getRect(
          positionComponent.x,
          positionComponent.y,
        );

        // Horizontal collision
        if (Math.abs(xSpeed) > 0) {

          const checkWidth = Math.abs(xSpeed) * delta;

          // Get coll check X
          const checkXStart: number = (xSpeed > 0
            ? collisionBox.right
            : collisionBox.left - checkWidth);

          const checkYStart: number = collisionBox.top;

          const dir = xSpeed > 0 ? 'right' : 'left';

          const solidCollision: PositionMetadata | null = mapComponent.getMapCollisionRect(
            checkXStart,
            checkYStart,
            checkWidth,
            height,
            dir,
          );

          // If one of them is a solid, stops
          if (solidCollision) {
            if (xSpeed > 0) {
              positionComponent.x = solidCollision.x * TILE_SIZE - width / 2;
            } else {
              positionComponent.x = solidCollision.x * TILE_SIZE
                + TILE_SIZE
                + width / 2;
            }

            velocityComponent.xSpeed = 0;
          }
        }

        const newPositionX = positionComponent.x + velocityComponent.xSpeed * delta;

        // Update collision box values
        collisionBox = collBoxComponent.getRect(
          newPositionX,
          positionComponent.y,
        );

        // Vertical collision
        if (Math.abs(ySpeed) > 0) {

          const collCheckHeight = Math.abs(ySpeed) * delta;

          const checkXStart: number = collisionBox.left;
          const checkYStart: number = (ySpeed > 0
            ? collisionBox.bottom
            : collisionBox.top - collCheckHeight);

          const dir = ySpeed > 0 ? 'down' : 'up';

          const solidCollision: PositionMetadata | null = mapComponent.getMapCollisionRect(
            checkXStart,
            checkYStart,
            width,
            collCheckHeight,
            dir,
          );

          // If one of them is a solid, stops
          if (solidCollision) {


            if (ySpeed > 0) {
              positionComponent.y = solidCollision.y * TILE_SIZE - height / 2;

              // If character, remove gravity component
              if (characterComponent) {
                characterComponent.onFloor = true;
                entity.removeComponent(COMPONENT_NAMES.Gravity);
              }
            } else {
              positionComponent.y = solidCollision.y * TILE_SIZE + TILE_SIZE + height / 2;
            }

            velocityComponent.ySpeed = 0;
          }
        }
      }
    });
  }
}

export default CollisionSystem;
