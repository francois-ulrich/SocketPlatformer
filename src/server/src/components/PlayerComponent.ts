import { Component } from 'super-ecs';

import { Socket } from 'socket.io';
import COMPONENT_NAMES from './types';

type InputMap = {
  [key: string]: boolean
}

class PlayerComponent implements Component {
  name = COMPONENT_NAMES.Player;

  public input: InputMap;

  public inputPressed: InputMap;

  public socket: Socket;

  public clientId: string;

  public roomName: string;

  constructor(socket: Socket, clientId: string, roomName: string) {
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    };

    this.inputPressed = { ...this.input };

    this.socket = socket;

    this.clientId = clientId;

    this.roomName = roomName;
  }
}

export default PlayerComponent;
