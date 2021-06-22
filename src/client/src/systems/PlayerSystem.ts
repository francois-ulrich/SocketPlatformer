import { World } from 'super-ecs';
import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PlayerComponent from '../components/PlayerComponent';
import VelocityComponent from '../components/VelocityComponent';

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

      const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
      );

      const speedIncr = 0.2;

      if (velocityComponent
        && playerComponent) {
        if (!playerComponent.input.right && !playerComponent.input.left) {
          if (velocityComponent.xSpeed > 0) {
            velocityComponent.xSpeed -= speedIncr;
          }

          if (velocityComponent.xSpeed < 0) {
            velocityComponent.xSpeed += speedIncr;
          }

          if (Math.abs(velocityComponent.xSpeed) < speedIncr) {
            velocityComponent.xSpeed = 0;
          }
        }

        if (playerComponent.input.right) {
          velocityComponent.xSpeed += speedIncr;
        }

        if (playerComponent.input.left) {
          velocityComponent.xSpeed -= speedIncr;
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
          COMPONENT_NAMES.Player,
        ]),
      )
      .subscribe((entity) => {
        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        if (playerComponent) {
          // Event listener for key press
          document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (['ArrowRight', 'ArrowLeft'].includes(e.key)) {
              // Prevent default browser behavior for key press
              e.preventDefault();
            }

            playerComponent.input.right = e.key === 'ArrowRight';
            playerComponent.input.left = e.key === 'ArrowLeft';
          });

          // Event listener for key press
          document.addEventListener('keyup', (e: KeyboardEvent) => {
            // Prevent default browser behavior for key press

            if (playerComponent.input.right && e.key === 'ArrowRight') {
              e.preventDefault();
              playerComponent.input.right = false;
            }

            if (playerComponent.input.left && e.key === 'ArrowLeft') {
              e.preventDefault();
              playerComponent.input.left = false;
            }
          });
        }
      });
  }
}

export default PlayerSystem;
