import { World } from 'super-ecs';

import { ExtendedSystem } from '../../../server/src/systems/ExtendedSystem';
import COMPONENT_NAMES from '../../../server/src/components/types';
// import PositionComponent from '../../../server/src/components/PositionComponent';
// import CollisionComponent from '../../../server/src/components/CollisionComponent';
import CharacterComponent from '../../../server/src/components/CharacterComponent';
import PlayerComponent from '../../../server/src/components/PlayerComponent';

class CharUpdateSystem extends ExtendedSystem {
  // update(): void {
  //     // Get entities under this system
  //     const entities = this.world.getEntities([
  //         COMPONENT_NAMES.Character,
  //         COMPONENT_NAMES.Player,
  //     ]);

  //     // Exit if no entities found
  //     if (entities.length === 0) {
  //         return;
  //     }
  // }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Character,
          COMPONENT_NAMES.Player,
        ]),
      )
      .subscribe((entity) => {
        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        // const characterComponent = entity.getComponent<CharacterComponent>(
        //     COMPONENT_NAMES.Character,
        // );

        if (playerComponent) {
          const { socket } = playerComponent;

          console.log("j'écoute..");

          // Listen to
          socket.on('characterUpdate', (data) => {
            console.log(data);
          });
        }
      });
  }
}

export default CharUpdateSystem;
