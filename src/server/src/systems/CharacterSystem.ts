import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

import CharacterComponent from '../components/CharacterComponent';
import CollisionComponent from '../components/CollisionComponent';
import VelocityComponent from '../components/VelocityComponent';
import GravityComponent from '../components/GravityComponent';
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';

class CharacterSystem extends ExtendedSystem {
  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Character]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
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

      const playerComponent = entity.getComponent<PlayerComponent>(
        COMPONENT_NAMES.Player,
      );

      // Get map entity
      const [mapEntity] = this.world.getEntities([COMPONENT_NAMES.Map]);

      if (!mapEntity) {
        return;
      }

      if (characterComponent) {
        // User input
        if (playerComponent) {
          characterComponent.input = playerComponent.input;
          characterComponent.inputPressed = playerComponent.inputPressed;
        }

        // Character input
        // Player movement
        if (velocityComponent) {
          const { onFloor, speedIncr } = characterComponent;

          // Stops if pressing left and right / not pressing any of the two buttons

          // Set direction
          if (
            (characterComponent.dirChangeMidAir
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

          // Jump
          if (characterComponent.input.jump && characterComponent.onFloor) {
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
                velocityComponent.xSpeed += speedIncr;
              }
              // Moving left
              if (characterComponent.input.left) {
                velocityComponent.xSpeed -= speedIncr;
              }
            }
          } else if (
            characterComponent.input.right
            || characterComponent.input.left
          ) {
            velocityComponent.xSpeed
              += speedIncr * characterComponent.direction;
          }
        }
      }

      // Get map component
      const mapComponent = mapEntity.getComponent<MapComponent>(
        COMPONENT_NAMES.Map,
      );

      if (characterComponent) {
        if (velocityComponent) {
          const { xSpeed } = velocityComponent;
          const { maxXSpeed } = characterComponent;

          // Limit xSpeed
          if (Math.abs(xSpeed) > maxXSpeed) {
            velocityComponent.xSpeed = maxXSpeed * Math.sign(xSpeed);
          }
        }

        // Fall if no floor under entity
        if (
          mapComponent
          && velocityComponent
          && collisionComponent
          && positionComponent
        ) {
          const { bottom, left } = collisionComponent.getCollisionBox(
            positionComponent.x,
            positionComponent.y,
          );

          const { width } = collisionComponent;

          const xStart: number = left;
          const yStart: number = bottom;
          const length: number = width - 1;
          const horizontal: boolean = true;

          characterComponent.onFloor = mapComponent.getMapCollisionLine(
            xStart,
            yStart,
            length,
            horizontal,
          );

          // If not on floor, make the entity fall
          if (!characterComponent.onFloor && !gravityComponent) {
            entity.addComponent(new GravityComponent());
          }

          if (characterComponent.onFloor && gravityComponent) {
            entity.removeComponent(COMPONENT_NAMES.Gravity);
          }
        }
      }
    });
  }
}

export default CharacterSystem;