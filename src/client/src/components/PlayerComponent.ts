import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import { Socket } from 'socket.io-client';

type InputMap = {
  [key: string]: boolean
}

class PlayerComponent implements Component {
  name = COMPONENT_NAMES.Player;

  public input: InputMap;

  public inputPressed: InputMap;

  public inputPrev: InputMap;

  public socket?: Socket;

  constructor(socket?: Socket) {
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
