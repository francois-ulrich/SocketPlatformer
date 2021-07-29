import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import MapComponent from '../components/MapComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollisionComponent from '../components/CollisionComponent';
import PositionComponent from '../components/PositionComponent';
import CharacterComponent from '../components/CharacterComponent';

// Types
import { PositionMetadata } from '../types/positionMetadata';

import { TILE_SIZE } from '../global';

class CollisionSystem extends ExtendedSystem {
  update(delta: number): void {
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Velocity,
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Collision,
    ]);

    // Loop through all entities
    entities.forEach((entity) => {
      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const collisionComponent = entity.getComponent<CollisionComponent>(
        COMPONENT_NAMES.Collision,
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
        && collisionComponent
        && velocityComponent
      ) {
        const { width, height } = collisionComponent;

        const { xSpeed, ySpeed } = velocityComponent;

        let collisionBox = collisionComponent.getCollisionBox(
          positionComponent.x,
          positionComponent.y,
        );

        // Horizontal collision
        if (Math.abs(xSpeed) > 0) {
          const collCheckWidth = Math.abs(xSpeed) * delta;

          // Get coll check X
          const checkXStart: number = (xSpeed > 0
            ? collisionBox.right
            : collisionBox.left - collCheckWidth);

          const checkYStart: number = collisionBox.top;

          const solidCollision: PositionMetadata | null = mapComponent.getMapCollisionRect(
            checkXStart,
            checkYStart,
            collCheckWidth,
            height,
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
        collisionBox = collisionComponent.getCollisionBox(
          newPositionX,
          positionComponent.y,
        );

        // Vertical collision
        if (Math.abs(ySpeed) > 0) {
          const collCheckHeight = Math.abs(ySpeed) * delta;

          // console.log(`collCheckHeight: ${collCheckHeight}`);
          // console.log(`ySpeed: ${ySpeed}`);

          const checkXStart: number = collisionBox.left;
          const checkYStart: number = (ySpeed > 0
            ? collisionBox.bottom
            : collisionBox.top - collCheckHeight);

          const solidCollision: PositionMetadata | null = mapComponent.getMapCollisionRect(
            checkXStart,
            checkYStart,
            width,
            collCheckHeight,
          );

          console.log(mapComponent.getMapCollisionRectData(
            checkXStart,
            checkYStart,
            width,
            collCheckHeight,
          ));

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
