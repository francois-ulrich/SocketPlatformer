import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class StairsComponent implements Component {
  name = COMPONENT_NAMES.Stairs;

  stairType: number;

  constructor() {
    this.stairType = 0;
  }
}

export default StairsComponent;
