import { World } from 'super-ecs';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

// Components
import CharacterComponent from '../components/CharacterComponent';
import CollBoxComponent from '../components/CollBoxComponent';
import VelocityComponent from '../components/VelocityComponent';
import GravityComponent from '../components/GravityComponent';
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';
import StairsComponent from '../components/StairsComponent';

// Globals
import { STAIR_TYPE } from '../../../server/src/global';

// Components
import SpriteComponent from '../components/SpriteComponent';

// Util
import setPlayerEntityOnStairs from '../util/setPlayerEntityOnStairs';

class CharacterSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  update(delta: number): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Character]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Get map entity
    const [mapEntity] = this.world.getEntities([COMPONENT_NAMES.Map]);

    if (!mapEntity) {
      return;
    }

    // Get map component
    const mapComponent = mapEntity.getComponent<MapComponent>(
      COMPONENT_NAMES.Map,
    );

    if (!mapComponent) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const stairsComponent = entity.getComponent<StairsComponent>(
        COMPONENT_NAMES.Stairs,
      );

      // Stairs component overrides character system logic
      if (stairsComponent) {
        return;
      }

      const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
      );

      const collBoxComponent = entity.getComponent<CollBoxComponent>(
        COMPONENT_NAMES.CollBox,
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

      // Get char position
      if (characterComponent) {
        // Stops if pressing left and right / not pressing any of the two buttons
        // Set direction
        if (velocityComponent
          && (characterComponent.dirChangeMidAir
            || velocityComponent.xSpeed === 0)
          && !(characterComponent.input.right && characterComponent.input.left)
        ) {
          // Moving right
          if (characterComponent.input.right) {
            characterComponent.direction = 1;
          }
          // Moving left
          if (characterComponent.input.left) {
            characterComponent.direction = -1;
          }
        }

        let walkDir = 0;

        const { maxXSpeed, onFloor, speedIncr } = characterComponent;
        // User input
        if (playerComponent) {
          characterComponent.input = playerComponent.input;
          characterComponent.inputPressed = playerComponent.inputPressed;
        }

        // Character input
        // Player movement
        if (velocityComponent && positionComponent && collBoxComponent) {
          const { x } = positionComponent;
          const { bottom } = collBoxComponent.getRect(
            positionComponent.x,
            positionComponent.y,
          );

          // Check for stair
          if (mapComponent) {
            // if (characterComponent.input.up) {
            if (onFloor) {
              if (
                characterComponent.input.up || characterComponent.input.down
              ) {
                const stairsCheckY = bottom - (characterComponent.input.up ? 1 : 0);

                const nearestStairX = mapComponent.getNearestStairX(
                  x,
                  stairsCheckY,
                  characterComponent.input.down,
                );

                if (nearestStairX !== null) {
                  if (Math.abs(nearestStairX - x) <= maxXSpeed * delta) {
                    positionComponent.x = nearestStairX;

                    // Get stair value
                    const stairVal = mapComponent.getStairVal(
                      positionComponent.x
                      - (characterComponent.input.down ? 1 : 0),
                      stairsCheckY,
                    );

                    // // Add stairs component
                    // const newStairsComponent = new StairsComponent();
                    // newStairsComponent.stairType = stairVal === 2
                    //   ? STAIR_TYPE.Asc
                    //   : STAIR_TYPE.Desc;

                    const stairType = stairVal === 2
                      ? STAIR_TYPE.Asc
                      : STAIR_TYPE.Desc;

                    // // Add stairs component
                    // entity.addComponent(newStairsComponent);

                    // velocityComponent.xSpeed = 0;
                    // velocityComponent.ySpeed = 0;

                    // // Remove gravity component
                    // entity.removeComponent(COMPONENT_NAMES.Gravity);
                    // entity.removeComponent(COMPONENT_NAMES.Collision);

                    setPlayerEntityOnStairs(entity, true, stairType);

                    return;
                  }

                  // Walk toward stairs if none encountered yet
                  if (x < nearestStairX) {
                    walkDir = 1; // Set character to walk right
                  } else {
                    walkDir = -1; // Set character to walk left
                  }
                }
              }
            }
          }

          // Jump
          if (characterComponent.input.jump && onFloor) {
            velocityComponent.ySpeed = -characterComponent.jumpForce;

            // Add gravity component
            entity.addComponent(new GravityComponent());
            characterComponent.onFloor = false;
          }

          if (onFloor) {
            if (
              (!characterComponent.input.right
                && !characterComponent.input.left)
              || (characterComponent.input.right && characterComponent.input.left)
            ) {
              if (velocityComponent.xSpeed > 0) {
                velocityComponent.xSpeed -= speedIncr;
              }

              if (velocityComponent.xSpeed < 0) {
                velocityComponent.xSpeed += speedIncr;
              }

              if (Math.abs(velocityComponent.xSpeed) < speedIncr) {
                velocityComponent.xSpeed = 0;
              }
            } else {
              // Moving right
              if (characterComponent.input.right) {
                walkDir = 1;
              }
              // Moving left
              if (characterComponent.input.left) {
                walkDir = -1;
              }
            }
          } else if (
            characterComponent.input.right
            || characterComponent.input.left
          ) {
            velocityComponent.xSpeed
              += speedIncr * characterComponent.direction;
          }

          velocityComponent.xSpeed += walkDir * speedIncr;
        }

        if (velocityComponent) {
          const { xSpeed } = velocityComponent;

          // Limit xSpeed
          if (Math.abs(xSpeed) > maxXSpeed) {
            velocityComponent.xSpeed = maxXSpeed * Math.sign(xSpeed);
          }

          // Fall if no floor under entity
          if (mapComponent && collBoxComponent && positionComponent) {
            const { bottom, left } = collBoxComponent.getRect(
              positionComponent.x,
              positionComponent.y,
            );

            const { width } = collBoxComponent;

            const { ySpeed } = velocityComponent;

            const xStart: number = left;
            const yStart: number = bottom;
            const length: number = width;
            const horizontal: boolean = true;

            const floorColl = ySpeed >= 0
              && mapComponent.getMapCollisionLine(
                xStart,
                yStart,
                length,
                horizontal,
              );

            const gravityComponent = entity.getComponent<GravityComponent>(
              COMPONENT_NAMES.Gravity,
            );

            // If not on floor, make the entity fall
            if (!floorColl && !gravityComponent) {
              entity.addComponent(new GravityComponent());
              characterComponent.onFloor = false;
            }
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
        world.entityAdded$([COMPONENT_NAMES.Character, COMPONENT_NAMES.Sprite]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        // Set initial sprite
        spriteComponent?.setAnimation('idle');
      });
  }
}

export default CharacterSystem;
