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
        // console.log(playerComponent.socket.id);
        // console.log(playerComponent.input);
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

          socket.on('inputDown', (key:string) => {
            playerComponent.input[key] = true;
          });

          socket.on('inputUp', (key:string) => {
            playerComponent.input[key] = false;
          });
        }
      });
  }

  removedFromWorld(world: World): void {
    this.disposeBag
      .completable$(
        world.entityRemoved$([
          COMPONENT_NAMES.Player,
          COMPONENT_NAMES.Character,
        ]),
      )
      .subscribe((entity) => {
        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        if (playerComponent) {
          const { socket, clientId } = playerComponent;

          socket.emit('player:delete', {
            clientId,
          });
        }
      });
  }
}

export default PlayerSystem;
