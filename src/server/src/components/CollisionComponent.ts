import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

class CollisionComponent implements Component {
  name = COMPONENT_NAMES.Collision;
}

export default CollisionComponent;
