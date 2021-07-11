import { World } from 'super-ecs';
import { MapMetadata } from '../types/mapMetadata';

class GameRoom {
  world: World;

  map: MapMetadata | null;

  clientsNumber: number;

  constructor({ map }: { map: MapMetadata }) {
    this.world = new World();
    this.map = map;
    this.clientsNumber = 0;
  }
}

export default GameRoom;
