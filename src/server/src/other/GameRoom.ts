import { World } from 'super-ecs';

class GameRoom {
    world: World;

    constructor() {
        this.world = new World();
    }
}

export default GameRoom;