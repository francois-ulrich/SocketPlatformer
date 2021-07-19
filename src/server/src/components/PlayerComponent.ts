import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

import { Socket } from "socket.io";

type InputMap = {
  [key: string]: boolean
}

class PlayerComponent implements Component {
  name = COMPONENT_NAMES.Player;

  public input: InputMap;

  public inputPressed: InputMap;

  public socket: Socket;

  public clientId: string;

  constructor(socket: Socket, clientId: string) {
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

    console.log(`User socket: ${this.socket.id}`);
  }
}

export default PlayerComponent;
