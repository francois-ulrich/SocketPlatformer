import { World } from 'super-ecs';
import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import PlayerComponent from '../components/PlayerComponent';

class PlayerSystem extends ExtendedSystem {
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
