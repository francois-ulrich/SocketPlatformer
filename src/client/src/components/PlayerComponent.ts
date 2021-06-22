import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class PlayerComponent implements Component {
    name = COMPONENT_NAMES.Player;

    public input: {
        left: Boolean,
        right: Boolean,
        up: Boolean,
        down: Boolean,
    }

    constructor() {
      this.input = {
        left: false,
        right: false,
        up: false,
        down: false,
      };
    }
}

export default PlayerComponent;
