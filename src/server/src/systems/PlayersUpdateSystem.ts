import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

import CharacterComponent from '../components/CharacterComponent';
// import CollisionComponent from '../components/CollisionComponent';
// import VelocityComponent from '../components/VelocityComponent';
// import GravityComponent from '../components/GravityComponent';
// import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';
import PlayerComponent from '../components/PlayerComponent';
// import SpriteComponent from '../components/SpriteComponent';

// Types
import { PlayerData, PlayersList } from '../types/player';

class CharacterSystem extends ExtendedSystem {
  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Player]);

    // Exit if no entities found
    if (entities.length === 0) {

    }

    // entities.forEach((entity) => {

    // });

    // const

    // // Loop through all entities
    // entities.forEach((entity) => {
    //   const characterComponent = entity.getComponent<CharacterComponent>(
    //     COMPONENT_NAMES.Character,
    //   );

    //   const playerComponent = entity.getComponent<PlayerComponent>(
    //     COMPONENT_NAMES.Player,
    //   );

    //   // const collisionComponent = entity.getComponent<CollisionComponent>(
    //   //   COMPONENT_NAMES.Collision,
    //   // );

    //   // const velocityComponent = entity.getComponent<VelocityComponent>(
    //   //   COMPONENT_NAMES.Velocity,
    //   // );

    //   const positionComponent = entity.getComponent<PositionComponent>(
    //     COMPONENT_NAMES.Position,
    //   );

    //   // const spriteComponent = entity.getComponent<SpriteComponent>(
    //   //   COMPONENT_NAMES.Sprite,
    //   // );

    //   if (playerComponent && positionComponent) {
    //     const { clientId } = playerComponent;
    //     const { x, y } = positionComponent;

    //     let emitData: any = {
    //       clientId
    //       x,
    //       y,
    //     };

    //     // If sprite data change, send it to client
    //     if (Object.keys(spriteData).length > 0) {
    //       emitData = { ...emitData, sprite: spriteData };
    //     }

    //     server.emit(`player:${clientId}`, emitData);
    //   }
    // });
  }
}

export default CharacterSystem;
