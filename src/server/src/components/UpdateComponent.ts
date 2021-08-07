import { Component } from 'super-ecs';
import { Server } from 'socket.io';

import COMPONENT_NAMES from './types';

class UpdateComponent implements Component {
    name = COMPONENT_NAMES.Update;

    roomName: string;

    io: Server;

    constructor(io: Server, roomName: string) {
      this.io = io;
      this.roomName = roomName;
    }
}

export default UpdateComponent;
