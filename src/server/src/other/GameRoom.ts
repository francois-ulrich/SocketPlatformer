import { World } from 'super-ecs';
import { MapMetadata } from '../types/mapMetadata';
import ClientsListMetadata from '../types/clientsListMetadata';
import GameLoop from './GameLoop';

class GameRoom {
    world: World;

    map: MapMetadata | null;

    name: string;

    clientsNumber: number;

    clients: ClientsListMetadata;

    gameLoop: GameLoop;

    constructor({ map, name }: { map: MapMetadata, name:string }) {
      this.world = new World();
      this.map = map;
      this.name = name;
      this.clientsNumber = 0;
      this.gameLoop = new GameLoop();
      this.clients = {};
    }
}

export default GameRoom;
