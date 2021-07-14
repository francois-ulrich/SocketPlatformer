import { Component } from 'super-ecs';
import { Socket } from 'socket.io-client';
import COMPONENT_NAMES from './types';

type InputMap = {
  [key: string]: boolean
}

class PlayerComponent implements Component {
  name = COMPONENT_NAMES.Player;

  public input: InputMap;

  public inputPressed: InputMap;

  public inputPrev: InputMap;

  public socket?: Socket;

  constructor(clientId:string, socket?: Socket) {
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    };

    this.inputPressed = { ...this.input };

    this.inputPrev = { ...this.input };

    this.socket = socket;
  }
}

export default PlayerComponent;
