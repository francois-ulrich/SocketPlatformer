import { World, Entity } from 'super-ecs';
import { Socket } from 'socket.io-client';

// ECS Components
import COMPONENT_NAMES from '../components/types';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';
import PlayerComponent from '../components/PlayerComponent';
import CharacterComponent from '../components/CharacterComponent';
import StairsComponent from '../components/StairsComponent';

// Systems
import PositionSystem from './PositionSystem';
import VelocitySystem from './VelocitySystem';
import CharacterSystem from './CharacterSystem';
import CollisionSystem from './CollisionSystem';
// import MapComponent from './MapComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import { PlayerInitMetadata } from '../../../server/src/types/player';

// Factories
import playersEntitiesFactory from '../factories/PlayerEntitiesFactory';

// Util
import setPlayerEntityOnStairs from '../util/setPlayerEntityOnStairs';
import getMapComponent from '../util/getMapComponent';

type PlayerSystemMetadata = ExtendedSystemMetadata & {
  socket: Socket;
  world: World;
};

class PlayerSystem extends ExtendedSystem {
  socket: Socket;

  constructor({ app, socket }: PlayerSystemMetadata) {
    super({ app });

    this.socket = socket;
  }

  update(delta: number): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Player]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      PlayerSystem.updateEntity(entity, delta);
    });
  }

  static updateEntity(entity:Entity, delta: number): void {
    const playerComponent = entity.getComponent<PlayerComponent>(
      COMPONENT_NAMES.Player,
    );

    // Player movement
    if (playerComponent) {
      const { socket } = playerComponent;

      if (socket) {
        // Reset all input pressed values
        Object.keys(playerComponent.input).forEach((key) => {
          const keyDown: boolean = playerComponent.input[key] === true;

          if (playerComponent.inputPrev[key] !== playerComponent.input[key]) {
            const type: string = keyDown ? 'Down' : 'Up';

            socket.emit(`input${type}`, key);
          }
        });
      }

      // Set object of previous inputs
      playerComponent.inputPrev = { ...playerComponent.input };
    }

    // Save state

    // Send stairs data
    const positionComponent = entity.getComponent<PositionComponent>(
      COMPONENT_NAMES.Position,
    );

    const characterComponent = entity.getComponent<CharacterComponent>(
      COMPONENT_NAMES.Character,
    );

    const velocityComponent = entity.getComponent<VelocityComponent>(
      COMPONENT_NAMES.Velocity,
    );

    const stairsComponent = entity.getComponent<StairsComponent>(
      COMPONENT_NAMES.Stairs,
    );

    if (
      playerComponent
      && positionComponent
      && characterComponent
      && velocityComponent
    ) {
      const { x, y } = positionComponent;
      const { clientId } = playerComponent;
      const { onFloor, direction, onStairs } = characterComponent;
      const { xSpeed, ySpeed } = velocityComponent;

      let stairs: PlayerStairsData | undefined;

      if (onStairs !== Boolean(stairsComponent)) {
        characterComponent.onStairs = Boolean(stairsComponent);

        stairs = {
          onStairs: Boolean(stairsComponent),
        };

        if (stairsComponent) {
          stairs = {
            ...stairs,
            stairsType: stairsComponent.stairType,
          };
        }
      }

      // Create result object
      const result = {
        timestamp: new Date().getTime(),
        delta,
        input: { ...playerComponent.input },
        clientId,
        x,
        y,
        xSpeed,
        ySpeed,
        stairs,
      };

      playerComponent.pastStates.push(result);
    }
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    this.disposeBag
      .completable$(world.entityAdded$([COMPONENT_NAMES.Player]))
      .subscribe((entity) => {
        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        const usedKeys = [
          'ArrowUp',
          'ArrowDown',
          'ArrowRight',
          'ArrowLeft',
          'Space',
          'KeyX',
        ];

        if (playerComponent && playerComponent.socket) {
          // Event listener for key press
          document.addEventListener('keydown', (e: KeyboardEvent) => {
            // Prevent default browser behavior for key press
            if (usedKeys.includes(e.code)) {
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
              case 'ArrowUp':
                playerComponent.input.up = true;
                playerComponent.inputPressed.up = playerComponent.input.up;
                break;
              case 'ArrowDown':
                playerComponent.input.down = true;
                playerComponent.inputPressed.down = playerComponent.input.down;
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
              e.preventDefault();
            }

            if (playerComponent.input.right && e.code === 'ArrowRight') {
              playerComponent.input.right = false;
            }

            if (playerComponent.input.left && e.code === 'ArrowLeft') {
              playerComponent.input.left = false;
            }

            if (playerComponent.input.up && e.code === 'ArrowUp') {
              playerComponent.input.up = false;
            }

            if (playerComponent.input.down && e.code === 'ArrowDown') {
              playerComponent.input.down = false;
            }

            if (playerComponent.input.jump && e.code === 'Space') {
              playerComponent.input.jump = false;
            }
          });
        }
      });

    this.addSocketListeners();
  }

  addSocketListeners(): void {
    const { socket, world } = this;

    socket.on('players:init', (data: PlayerInitMetadata) => {
      const { clientId, players } = data;

      // console.log(players);

      // Add all entities
      Object.entries(players).forEach(([id, playerData]) => {
        const newPlayerEntity = playersEntitiesFactory(
          playerData,
          id === clientId ? socket : undefined,
        );

        world.addEntity(newPlayerEntity);
      });
    });

    socket.on('player:add', (data) => {
      const newPlayerEntity = playersEntitiesFactory(data);

      world.addEntity(newPlayerEntity);
    });

    socket.on('players:update', (playersData) => {
      // Update each players
      Object.keys(playersData).forEach((clientId) => {
        const playerData = playersData[clientId];

        const {
          x, y, xSpeed, ySpeed, sprite, stairs,
        } = playerData;

        const entity = PlayerSystem.getPlayerEntityFromClientId(
          this.world,
          clientId,
        );

        if (entity) {
          // Position update
          const spriteComponent = entity.getComponent<SpriteComponent>(
            COMPONENT_NAMES.Sprite,
          );

          const playerComponent = entity.getComponent<PlayerComponent>(
            COMPONENT_NAMES.Player,
          );

          const positionComponent = entity.getComponent<PositionComponent>(
            COMPONENT_NAMES.Position,
          );

          const velocityComponent = entity.getComponent<VelocityComponent>(
            COMPONENT_NAMES.Velocity,
          );

          if (positionComponent) {
            positionComponent.x = x;
            positionComponent.y = y;
          }

          if (velocityComponent) {
            velocityComponent.xSpeed = xSpeed;
            velocityComponent.ySpeed = ySpeed;
          }

          if (spriteComponent && sprite) {
            if (sprite.name) {
              spriteComponent.setAnimation(sprite.name);
            }

            if (sprite.scale) {
              if (sprite.scale.x) {
                spriteComponent.setXScale(sprite.scale.x);
              }

              if (sprite.scale.y) {
                spriteComponent.setYScale(sprite.scale.y);
              }
            }

            if (typeof sprite.frameSpeed === 'number') {
              spriteComponent.setFrameSpeed(sprite.frameSpeed);
            }
          }

          if (stairs !== undefined) {
            const { onStairs, stairsType } = stairs;

            // Set stairs component
            setPlayerEntityOnStairs(entity, onStairs, stairsType);
          }

          // // Update past state buffer
          // if (playerComponent
          //   && positionComponent
          //   && velocityComponent) {
          //   const { pastStates, input } = playerComponent;

          //   const { x, y } = positionComponent;
          //   const { xSpeed, ySpeed } = velocityComponent;

          //   // Discard any buffered state older than the corrected state from the server
          //   playerComponent.pastStates = pastStates.filter(
          //     (state) => state.timestamp >= new Date().getTime(),
          //   );

          //   // Replays the state starting from the corrected state
          //   // back to the present “predicted” time

          //   if (pastStates.length > 0) {
          //     const firstState = pastStates[0];

          //     if (firstState.x && firstState.y) {
          //       positionComponent.x = firstState.x;
          //       positionComponent.y = firstState.y;
          //     }

          //     if (firstState.xSpeed && firstState.ySpeed) {
          //       velocityComponent.xSpeed = firstState.xSpeed;
          //       velocityComponent.ySpeed = firstState.ySpeed;
          //     }

          //     pastStates.forEach((state) => {
          //       // Get map entity
          //       const mapComponent = getMapComponent(this.world);

          //       if (mapComponent) {
          //         PlayerSystem.updateEntity(entity, state.delta);
          //         CharacterSystem.updateEntity(
          //           entity,
          //           mapComponent,
          //           state.delta,
          //         );
          //         CollisionSystem.updateEntity(
          //           entity,
          //           mapComponent,
          //           state.delta,
          //         );
          //         VelocitySystem.updateEntity(entity, state.delta);
          //         PositionSystem.updateEntity(entity);
          //       }
          //     });
          //   }

          //   playerComponent.input = input;

          //   positionComponent.x = x;
          //   positionComponent.y = y;

          //   velocityComponent.xSpeed = xSpeed;
          //   velocityComponent.ySpeed = ySpeed;

          //   /*
          //     world
          //       .addSystem(new PlayerSystem({ app, socket, world }))
          //       .addSystem(new CharacterSystem({ app }))
          //       .addSystem(new StairsSystem({ app }))
          //       .addSystem(new GravitySystem({ app }))
          //       .addSystem(new CollisionSystem({ app }))
          //       .addSystem(new VelocitySystem({ app }))
          //       .addSystem(new PositionSystem({ app }))
          //       .addSystem(new MapSystem({ app }))
          //       .addSystem(new SpriteSystem({ app }))
          //     ;
          //   */

          //   // Set value from first buffered player state
          // }
        }
      });
    });

    socket.on('player:delete', (data) => {
      const { clientId } = data;

      // Find entity to delete
      const playerEntities = world.getEntities([COMPONENT_NAMES.Player]);

      for (let i = 0; i < playerEntities.length; i += 1) {
        const entity = playerEntities[i];

        const playerComponent = entity.getComponent<PlayerComponent>(
          COMPONENT_NAMES.Player,
        );

        if (playerComponent && clientId === playerComponent.clientId) {
          world.removeEntity(entity);
        }
      }
    });
  }

  // TODO: Move getPlayerEntityFromClientId function
  static getPlayerEntityFromClientId(
    world: World,
    clientId: string,
  ): Entity | null {
    // Get player entities
    const entities = world.getEntities([COMPONENT_NAMES.Player]);

    // Loop through entities to find player entity
    for (let i: number = 0; i < entities.length; i += 1) {
      const entity = entities[i];

      const playerComponent = entity.getComponent<PlayerComponent>(
        COMPONENT_NAMES.Player,
      );

      if (playerComponent) {
        if (playerComponent.clientId === clientId) {
          return entity;
        }
      }
    }

    return null;
  }
}

export default PlayerSystem;
