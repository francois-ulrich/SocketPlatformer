import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class GravityComponent implements Component {
  name = COMPONENT_NAMES.Gravity;

  force: number;

  enabled: boolean;

  constructor() {
    this.force = 0.2;
    this.enabled = false;
  }
}

export default GravityComponent;
