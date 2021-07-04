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

  // update(delta: number): void {
  update(): void {
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

      /* TODO: Utiliser la méthode de détection de collision du MapComponent
      (servira à checker le onFloor de manière plus sûre) */
      if (mapComponent
        && positionComponent
        && collisionComponent
        && velocityComponent) {
        const {
          width,
          height,
        } = collisionComponent;

        const { xSpeed, ySpeed } = velocityComponent;

        let collisionBox = collisionComponent.getCollisionBox(
          positionComponent.x,
          positionComponent.y,
        );

        // Horizontal collision
        if (Math.abs(xSpeed) > 0) {
          // // Get coll check X
          const checkXStart: number = (
            xSpeed > 0
              ? collisionBox.right
              : collisionBox.left) + xSpeed;

          const checkYStart: number = collisionBox.top;

          const solidCollision: boolean = mapComponent.getMapCollisionLine(
            checkXStart,
            checkYStart,
            height,
            false,
          );

          // If one of them is a solid, stops
          if (solidCollision) {
            if (xSpeed > 0) {
              positionComponent.x = MapComponent.getTilePosition(collisionBox.right + xSpeed)
                * TILE_SIZE - width / 2;
            } else {
              positionComponent.x = MapComponent.getTilePosition(collisionBox.left - xSpeed)
                * TILE_SIZE + width / 2;
            }

            velocityComponent.xSpeed = 0;
          }
        }

        // Update collision box values
        collisionBox = collisionComponent.getCollisionBox(
          positionComponent.x + velocityComponent.xSpeed,
          positionComponent.y,
        );

        // Vertical collision
        if (Math.abs(ySpeed) > 0) {
          const checkXStart: number = collisionBox.left;
          const checkYStart: number = (ySpeed > 0
            ? collisionBox.bottom
            : collisionBox.top) + ySpeed;

          const solidCollision: boolean = mapComponent.getMapCollisionLine(
            checkXStart,
            checkYStart,
            width,
            true,
          );

          // If one of them is a solid, stops
          // if (colls.includes(1)) {
          if (solidCollision) {
            if (ySpeed > 0) {
              positionComponent.y = MapComponent.getTilePosition(collisionBox.bottom + ySpeed)
                  * TILE_SIZE
                - height / 2;
            } else {
              positionComponent.y = MapComponent.getTilePosition(collisionBox.top - ySpeed)
                  * TILE_SIZE
                + height / 2;
            }

            velocityComponent.ySpeed = 0;
          }
        }
      }
    });
  }

  // addedToWorld(world: World): void {
  //   super.addedToWorld(world);

  //   // Add sprite to stage
  //   this.disposeBag
  //     .completable$(
  //       world.entityAdded$([
  //         COMPONENT_NAMES.Collision,
  //       ]),
  //     )
  //     .subscribe((entity) => {
  //       const collisionComponent = entity.getComponent<CollisionComponent>(
  //         COMPONENT_NAMES.Collision,
  //       );

  //       if (collisionComponent) {
  //         this.app.stage.addChild(collisionComponent.debugRect);
  //       }
  //     });
  // }
}

export default CollisionSystem;
