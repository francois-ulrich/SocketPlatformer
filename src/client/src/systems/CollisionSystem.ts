import { World } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import MapComponent from '../components/MapComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollisionComponent from '../components/CollisionComponent';
import PositionComponent from '../components/PositionComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';
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

      if (positionComponent
                && collisionComponent
                && velocityComponent) {
        const { x, y } = positionComponent;
        const { width, height } = collisionComponent;

        // Collision box coordinates update
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        collisionComponent.collisionBox = {
          top: y - halfHeight,
          bottom: y + halfHeight,
          left: x - halfWidth,
          right: x + halfWidth,
        };
      }

      // Collision checking

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

      if (mapComponent
                && positionComponent
                && collisionComponent
                && velocityComponent) {
        const {
          collisionBox: {
            top,
            bottom,
            left,
            right,
          },
          width,
          height,
        } = collisionComponent;

        const { xSpeed, ySpeed } = velocityComponent;

        // Horizontal collision
        if (Math.abs(xSpeed) > 0) {
          // Get coll check X
          const checkX = (xSpeed > 0 ? right : left) + xSpeed;

          // Create collisions array
          const colls: Array<number> = [];

          // Get number of collisions needed to be checked,
          // varies depending on the height of the entity
          const collsNb: number = Math.max(2, Math.floor(height / TILE_SIZE) + 1);
          const gap = (height / Math.ceil(height / TILE_SIZE));

          // Check every collisions
          for (let i = 0; i < collsNb; i += 1) {
            const checkY = (top + i * gap) - (i === collsNb - 1 ? 1 : 0);
            colls.push(mapComponent.getCollision({ x: checkX, y: checkY }));
          }

          // If one of them is a solid, stops
          if (colls.includes(1)) {
            if (xSpeed > 0) {
              positionComponent.x = (mapComponent.getTilePosition({ x: (right + xSpeed) }).x)
                    * TILE_SIZE - width / 2;
            } else {
              positionComponent.x = (mapComponent.getTilePosition({ x: (left - xSpeed) }).x)
                    * TILE_SIZE + width / 2;
            }

            velocityComponent.xSpeed = 0;
          }
        }

        positionComponent.x += velocityComponent.xSpeed * delta;

        // Vertical collision
        if (Math.abs(ySpeed) > 0) {
          // Get coll check X
          const checkY = (ySpeed > 0 ? bottom : top) + ySpeed;
          const gap = (height / Math.ceil(height / TILE_SIZE));

          // Create collisions array
          const colls: Array<number> = [];

          // Get number of collisions needed to be checked,
          // varies depending on the width of the entity
          const collsNb: number = Math.max(2, Math.floor(width / TILE_SIZE) + 1);

          // Check every collisions
          for (let i = 0; i < collsNb; i += 1) {
            const checkX = (left + i * gap) - (i === collsNb - 1 ? 1 : 0);
            colls.push(mapComponent.getCollision({ x: checkX, y: checkY }));
          }

          // If one of them is a solid, stops
          if (colls.includes(1)) {
            if (ySpeed > 0) {
              positionComponent.y = (mapComponent.getTilePosition({ y: (bottom + ySpeed) }).y)
                    * TILE_SIZE - height / 2;
            } else {
              positionComponent.y = (mapComponent.getTilePosition({ y: (top - ySpeed) }).y)
                    * TILE_SIZE + height / 2;
            }

            velocityComponent.ySpeed = 0;
          }
        }

        positionComponent.y += velocityComponent.ySpeed * delta;
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Collision,
        ]),
      )
      .subscribe((entity) => {
        const collisionComponent = entity.getComponent<CollisionComponent>(
          COMPONENT_NAMES.Collision,
        );

        if (collisionComponent) {
          this.app.stage.addChild(collisionComponent.debugRect);
        }
      });
  }
}

export default CollisionSystem;
