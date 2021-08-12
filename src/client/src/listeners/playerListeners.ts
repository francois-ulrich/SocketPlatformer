import { World, Entity } from 'super-ecs';
import { Socket } from 'socket.io-client';

// ECS Stuff
import COMPONENT_NAMES from '../components/types';

// Component
import MapComponent from '../components/MapComponent';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';
import PlayerComponent from '../components/PlayerComponent';
import CharacterComponent from '../components/CharacterComponent';

// Types
import { MapMetadata } from '../../../server/src/types/mapMetadata';
import GameRoomMetadata from '../../../server/src/types/gameRoomMetadata';
import { SpriteMetadata } from '../types/spriteMetadata';
// import { MapMetadata } from '../../shared/src/types/mapMetadata';
// import GameRoomMetadata from '../../shared/src/types/gameRoomMetadata';

import { PlayerData } from '../server/src/types/player';



import getPlayerEntityFromClientId from '../util/getPlayerEntityFromClientId';

// Temp: add test entity
function createPlayerEntity(data: PlayerData, socket?: Socket): Entity {
  const { clientId, x, y } = data;

  const playerEntity: Entity = new Entity();
  const sprite: SpriteMetadata = spriteData;

  playerEntity
    // .addComponent(new VelocityComponent())
    .addComponent(new PositionComponent({ x, y }))
    .addComponent(new CharacterComponent())
    .addComponent(new SpriteComponent(sprite))
    .addComponent(new PlayerComponent(clientId, socket));

  return playerEntity;
}

const playerListeners = (socket: Socket, world: World) => {
  // socket.on('connect', () => {
  //   // Make player automatically join the test room
  //   socket.emit('join', 'test');

  //   // =============
  //   socket.on('players:init', (data) => {
  //     console.log('Init player');

  //     const { clientId, players } = data;

  //     // Add all entities
  //     Object.entries(players).forEach(([id, playerData]) => {
  //       const newPlayerEntity = createPlayerEntity(
  //         playerData,
  //         id === clientId ? socket : null,
  //       );

  //       world.addEntity(newPlayerEntity);
  //     });
  //   });

  //   socket.on('player:add', (data) => {
  //     console.log(data);
  //     const newPlayerEntity = createPlayerEntity(data);

  //     world.addEntity(newPlayerEntity);
  //   });

  //   socket.on('players:update', (playersData) => {
  //     // console.log(Object.entries(playersData));

  //     // Update each players
  //     Object.keys(playersData).forEach((clientId) => {
  //       const playerData = playersData[clientId];

  //       const { x, y } = playerData;

  //       const entity = getPlayerEntityFromClientId(world, clientId);

  //       // console.log(entity);

  //       if (entity) {
  //         const positionComponent = entity.getComponent<PositionComponent>(
  //           COMPONENT_NAMES.Position,
  //         );

  //         if (positionComponent) {
  //           positionComponent.x = x;
  //           positionComponent.y = y;

  //           // console.log(x, y);
  //         }
  //       }
  //     });

  //     // // Add all entities
  //     // Object.entries(players).forEach(([id, playerData]) => {
  //     //   const newPlayerEntity = createPlayerEntity(playerData);

  //     //   // Add player component on client's player
  //     //   if (id === clientId) {
  //     //     newPlayerEntity.addComponent(new PlayerComponent(clientId, socket));
  //     //   }

  //     //   world.addEntity(newPlayerEntity);
  //     // });
  //   });

  //   socket.on('player:delete', (data) => {
  //     const { clientId } = data;

  //     // Find entity to delete
  //     const playerEntities = world.getEntities([COMPONENT_NAMES.Player]);

  //     for (let i = 0; i < playerEntities.length; i += 1) {
  //       const entity = playerEntities[i];

  //       const playerComponent = entity.getComponent<PlayerComponent>(
  //         COMPONENT_NAMES.Player,
  //       );

  //       if (playerComponent && clientId === playerComponent.clientId) {
  //         world.removeEntity(entity);
  //       }
  //     }
  //   });

  //   socket.on('gameRoom:init', (data: GameRoomMetadata) => {
  //     console.log('Initializing client game room...');

  //     // Initialize map
  //     const mapData: MapMetadata = data.map;

  //     const mapEntity: Entity = new Entity();
  //     mapEntity.addComponent(new MapComponent(mapData));
  //     world.addEntity(mapEntity);

  //     // Start world
  //     app.ticker.add((deltaTime) => world.update(deltaTime));
  //   });
  // });
};

export default playerListeners;
