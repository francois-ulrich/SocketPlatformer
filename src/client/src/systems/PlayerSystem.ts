import { World, Entity } from 'super-ecs';
import { Socket } from 'socket.io-client';

// ECS Components
import COMPONENT_NAMES from '../components/types';
import VelocityComponent from '../components/VelocityComponent';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';
import PlayerComponent from '../components/PlayerComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import { PlayerInitMetadata } from '../../../server/src/types/player';

// Factories
import playersEntitiesFactory from '../factories/PlayerEntitiesFactory';

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

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Player]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
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
    });
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

        const { x, y, xSpeed, ySpeed, sprite } = playerData;

        const entity = PlayerSystem.getPlayerEntityFromClientId(
          this.world,
          clientId,
        );

        if (entity) {
          // Position update
          const spriteComponent = entity.getComponent<SpriteComponent>(
            COMPONENT_NAMES.Sprite,
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
