// import { Entity, World } from 'super-ecs';
import { World } from 'super-ecs';
import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

// Components
import CharacterComponent from '../components/CharacterComponent';
import VelocityComponent from '../components/VelocityComponent';
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';
import StairsComponent from '../components/StairsComponent';
import CollBoxComponent from '../components/CollBoxComponent';
// import CollisionComponent from '../components/CollisionComponent';
// import GravityComponent from '../components/GravityComponent';

import { TILE_SIZE } from '../global';

// Util
import setPlayerEntityOnStairs from '../util/setPlayerEntityOnStairs';

class StairsSystem extends ExtendedSystem {
  update(delta: number): void {
    // update(): void {
    // Get entities under stair system
    const entities = this.world.getEntities([COMPONENT_NAMES.Stairs]);

    // Get map entity
    const [mapEntity] = this.world.getEntities([COMPONENT_NAMES.Map]);

    if (!mapEntity) {
      return;
    }

    // Get map component
    const mapComponent = mapEntity.getComponent<MapComponent>(
      COMPONENT_NAMES.Map,
    );

    // If no map component, exit
    if (!mapComponent) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const stairsComponent = entity.getComponent<StairsComponent>(
        COMPONENT_NAMES.Stairs,
      );

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

      const collBoxComponent = entity.getComponent<CollBoxComponent>(
        COMPONENT_NAMES.CollBox,
      );

      if (
        characterComponent
        && stairsComponent
        && velocityComponent
        && positionComponent
        && playerComponent
        && collBoxComponent
      ) {
        const { x, y } = positionComponent;
        const { stairType } = stairsComponent;
        const { stairsSpeed } = characterComponent;
        const { bottom } = collBoxComponent.getRect(x, y);

        // Get user input
        let walkDir: number = 0;
        let ySpeed: number = 0;

        // Set walk direction
        if (characterComponent.input.up) {
          walkDir = stairType;
        } else if (characterComponent.input.down) {
          walkDir = -stairType;
        } else if (characterComponent.input.right) {
          walkDir = 1;
        } else if (characterComponent.input.left) {
          walkDir = -1;
        }

        // Adjust character direction
        characterComponent.direction = walkDir;

        // If character is going somewhere, check stairs and move
        if (walkDir !== 0) {
          ySpeed = -stairsSpeed * walkDir * stairType;

          // Check if getting off the stairs
          const actualWalkSpeed: number = stairsSpeed * delta;
          const verDir: number = Math.sign(ySpeed);

          const stairsCheckPos = {
            x: x + actualWalkSpeed * walkDir,
            y: bottom + actualWalkSpeed * verDir,
          };

          // Check if no more stairs above / no more stairs below
          const stairsCheck = mapComponent.getStairVal(
            stairsCheckPos.x,
            stairsCheckPos.y,
          );

          // If one of these conditions are met, character gets off the stairs
          if (stairsCheck === 0) {
            // // Remove stairs component cuz left stars & s'all good
            // entity.removeComponent(COMPONENT_NAMES.Stairs);

            // // Add components
            // entity.addComponent(new GravityComponent());
            // entity.addComponent(new CollisionComponent());

            setPlayerEntityOnStairs(entity, false);

            // Set right X / Y pos
            positionComponent.x = Math.round(x / TILE_SIZE) * TILE_SIZE;
            positionComponent.y = Math.round(y / TILE_SIZE) * TILE_SIZE;
          }
        }

        velocityComponent.xSpeed = stairsSpeed * walkDir;
        velocityComponent.ySpeed = ySpeed;
      }
    });
  }


  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Stairs,
        ]),
      )
      .subscribe((entity) => {
        const stairsComponent = entity.getComponent<StairsComponent>(
          COMPONENT_NAMES.Stairs,
        );

        if (stairsComponent) {
          console.log('StairsComponent ADDED');
        }
      });

    this.disposeBag
      .completable$(
        world.entityRemoved$([
          COMPONENT_NAMES.Stairs,
        ]),
      )
      .subscribe(() => {
        console.log('StairsComponent REMOVED');
      });
  }
}

export default StairsSystem;
