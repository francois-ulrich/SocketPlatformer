import { World } from 'super-ecs';
import { MapMetadata } from '../types/mapMetadata';
import ClientsListMetadata from '../types/clientsListMetadata';
import GameLoop from './GameLoop';


class GameRoom {
    world: World;

    map: MapMetadata | null;

    clientsNumber: number;

    clients: ClientsListMetadata;

    gameLoop: GameLoop;

    constructor({ map }: { map: MapMetadata }) {
        this.world = new World();
        this.map = map;
        this.clientsNumber = 0;
        this.gameLoop = new GameLoop();
        this.clients = {};
    }
}

export default GameRoom;