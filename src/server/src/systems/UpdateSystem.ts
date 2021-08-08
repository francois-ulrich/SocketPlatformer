// import { World } from 'super-ecs';

import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

// import CharacterComponent from '../components/CharacterComponent';
// import CollisionComponent from '../components/CollisionComponent';
// import VelocityComponent from '../components/VelocityComponent';
// import GravityComponent from '../components/GravityComponent';
// import MapComponent from '../components/MapComponent';
// import PositionComponent from '../components/PositionComponent';
// import PlayerComponent from '../components/PlayerComponent';
// import SpriteComponent from '../components/SpriteComponent';
import UpdateComponent from '../components/UpdateComponent';

import getPlayerDataFromEntity from '../util/getPlayerDataFromEntity';
import getPlayerClientId from '../util/getPlayerClientId';

// Types
import { PlayersList } from '../types/player';

class UpdateSystem extends ExtendedSystem {
  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Player,
    ]);

    const updateEntity = this.world.getEntities([
      COMPONENT_NAMES.Update,
    ])[0];

    // Exit if no entities found
    if (entities.length === 0
            || !updateEntity) {
      return;
    }

    // Send their data to
    const playersData: PlayersList = {};

    entities.forEach((entity) => {
      const playerData = getPlayerDataFromEntity(entity);

      // Get client ID
      const clientId = getPlayerClientId(entity);

      if (playerData && clientId) {
        playersData[clientId] = playerData;
      }
    });

    const updateComponent = updateEntity.getComponent<UpdateComponent>(
      COMPONENT_NAMES.Update,
    );

    // Send player and other players data to client
    if (updateComponent) {
      updateComponent
        .io
        .in(updateComponent.roomName)
        .emit('players:update', playersData);
    }
  }
}

export default UpdateSystem;
