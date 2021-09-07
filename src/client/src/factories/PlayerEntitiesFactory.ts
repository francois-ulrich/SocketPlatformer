import { Entity } from 'super-ecs';
import { Socket } from 'socket.io-client';

// ECS Components
import PositionComponent from '../components/PositionComponent';
import CharacterComponent from '../components/CharacterComponent';
import SpriteComponent from '../components/SpriteComponent';
import PlayerComponent from '../components/PlayerComponent';
import GravityComponent from '../components/GravityComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollBoxComponent from '../components/CollBoxComponent';
import CollisionComponent from '../components/CollisionComponent';
import ReconciliationComponent from '../components/ReconciliationComponent';

// Types
import { PlayerData } from '../../../server/src/types/player';
import { SpriteMetadata } from '../types/spriteMetadata';

// Assets
import simonSpriteData from '../assets/sprites/simon/data';

function playersEntitiesFactory(data: PlayerData, socket?: Socket): Entity {
  const { clientId, x, y } = data;

  const playerEntity: Entity = new Entity();
  const sprite: SpriteMetadata = simonSpriteData;

  playerEntity
    .addComponent(new PositionComponent(x, y))
    .addComponent(new GravityComponent())
    .addComponent(new VelocityComponent())
    .addComponent(new CharacterComponent())
    .addComponent(new SpriteComponent(sprite))
    .addComponent(new PlayerComponent(clientId, socket))
    .addComponent(new CollBoxComponent({ width: 16, height: 32 }))
    .addComponent(new CollisionComponent())
    .addComponent(new ReconciliationComponent());

  return playerEntity;
}

export default playersEntitiesFactory;
