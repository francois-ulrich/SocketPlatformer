import { World } from 'super-ecs';
// import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import SpriteComponent from '../components/SpriteComponent';
import EntityComponent from '../components/EntityComponent';
import PositionComponent from '../components/PositionComponent';
import VelocityComponent from '../components/VelocityComponent';
import GravityComponent from '../components/GravityComponent';
import PlayerComponent from '../components/PlayerComponent';

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
      COMPONENT_NAMES.Sprite,
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

      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const gravityComponent = entity.getComponent<GravityComponent>(
        COMPONENT_NAMES.Gravity,
      );

      const playerComponent = entity.getComponent<PlayerComponent>(
        COMPONENT_NAMES.Player,
      );

      if (playerComponent) {
        // console.log("player stuff");
      }

      if (
        entityComponent
        && spriteComponent
        && positionComponent
        && velocityComponent
        && gravityComponent
      ) {
        // Limit xSpeed
        if (Math.abs(velocityComponent.xSpeed) > entityComponent.maxXSpeed) {
          velocityComponent.xSpeed = entityComponent.maxXSpeed
            * Math.sign(velocityComponent.xSpeed);
        }
      }
    });
  }

  // addedToWorld(world: World): void {
  //     super.addedToWorld(world);

  //     // Add sprite to stage
  //     this.disposeBag
  //         .completable$(
  //             world.entityAdded$([
  //                 COMPONENT_NAMES.Entity,
  //                 COMPONENT_NAMES.Sprite,
  //             ]),
  //         )
  //         .subscribe((entity) => {
  //             // const EntityComponent = entity.getComponent<EntityComponent>(
  //             //     COMPONENT_NAMES.Entity,
  //             // );

  //             // const spriteComponent = entity.getComponent<SpriteComponent>(
  //             //     COMPONENT_NAMES.Sprite,
  //             // );

  //             // if (spriteComponent && EntityComponent) {
  //             // }
  //         });

  // }
}

export default EntitySystem;
