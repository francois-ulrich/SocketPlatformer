import { World } from 'super-ecs';
import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PlayerComponent from '../components/PlayerComponent';
import VelocityComponent from '../components/VelocityComponent';
import EntityComponent from '../components/EntityComponent';
import GravityComponent from '../components/GravityComponent';

class PlayerSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Player,
      COMPONENT_NAMES.Velocity,
      COMPONENT_NAMES.Gravity,
      COMPONENT_NAMES.Entity,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const playerComponent = entity.getComponent<PlayerComponent>(
        COMPONENT_NAMES.Player,
      );

      const entityComponent = entity.getComponent<EntityComponent>(
        COMPONENT_NAMES.Entity,
      );

      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const gravityComponent = entity.getComponent<GravityComponent>(
        COMPONENT_NAMES.Gravity,
      );

      // Player movement
      const speedIncr = 0.2;

      if (velocityComponent
        && entityComponent
        && gravityComponent
        && playerComponent) {
        // Stops if pressing left and right / not pressing any of the two buttons
        if ((!playerComponent.input.right && !playerComponent.input.left)
          || (playerComponent.input.right && playerComponent.input.left)) {
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
          if (playerComponent.input.right) {
            velocityComponent.xSpeed += speedIncr;
          }
          // Moving left
          if (playerComponent.input.left) {
            velocityComponent.xSpeed -= speedIncr;
          }
        }

        // Jump
        if (playerComponent.inputPressed.jump && entityComponent.onFloor) {
          velocityComponent.ySpeed = -entityComponent.jumpForce;
          gravityComponent.enabled = true;
          entityComponent.onFloor = false;
        }

        // Reset all input pressed values
        Object.keys(playerComponent.inputPressed).forEach((keyCode) => {
          playerComponent.inputPressed[keyCode] = false;
        });
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Player,
        ]),
      )
      .subscribe((entity) => {
        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        const usedKeys = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Space'];

        if (playerComponent) {
          // Event listener for key press
          document.addEventListener('keydown', (e: KeyboardEvent) => {
            // Prevent default browser behavior for key press
            if (usedKeys.includes(e.key)) {
              // Prevent default browser behavior for key press
              e.preventDefault();
            }

            switch (e.code) {
              case 'ArrowRight':
                playerComponent.input.right = true;
                playerComponent.inputPressed.right = playerComponent.input.right;
                break;
              case 'ArrowLeft':
                playerComponent.input.left = true;
                playerComponent.inputPressed.left = playerComponent.input.left;
                break;
              case 'Space':
                playerComponent.input.jump = true;
                playerComponent.inputPressed.jump = playerComponent.input.jump;
                break;
              default:
                break;
            }
          });

          // Event listener for key press
          document.addEventListener('keyup', (e: KeyboardEvent) => {
            // Prevent default browser behavior for key press
            if (usedKeys.includes(e.code)) {
              // Prevent default browser behavior for key press
              e.preventDefault();
            }

            if (playerComponent.input.right && e.code === 'ArrowRight') {
              playerComponent.input.right = false;
            }

            if (playerComponent.input.left && e.code === 'ArrowLeft') {
              playerComponent.input.left = false;
            }

            if (playerComponent.input.jump && e.code === 'Space') {
              playerComponent.input.jump = false;
            }
          });
        }
      });
  }
}

export default PlayerSystem;
