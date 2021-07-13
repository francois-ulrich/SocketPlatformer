import { World } from 'super-ecs';
import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PlayerComponent from '../components/PlayerComponent';

class PlayerSystem extends ExtendedSystem {
  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Player,
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

      if (playerComponent) {

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
          const { socket } = playerComponent;

          socket.on("inputDown", (keyCode) => {
            switch (keyCode) {
              case 'ArrowRight':
                playerComponent.input.right = true;
                break;
              case 'ArrowLeft':
                playerComponent.input.left = true;
                break;
              case 'Space':
                playerComponent.input.jump = true;
                break;
              default:
                break;
            }
          });

          socket.on("inputUp", (keyCode) => {
            if (playerComponent.input.right && keyCode === 'ArrowRight') {
              playerComponent.input.right = false;
            }

            if (playerComponent.input.left && keyCode === 'ArrowLeft') {
              playerComponent.input.left = false;
            }

            if (playerComponent.input.jump && keyCode === 'Space') {
              playerComponent.input.jump = false;
            }
          });
        }
      });
  }
}

export default PlayerSystem;
