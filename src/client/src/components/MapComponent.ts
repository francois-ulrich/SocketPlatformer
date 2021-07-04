import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import MapMetadata from '../types/mapMetadata';

import { TILE_SIZE } from '../global';

type MapComponentMetadata = {
  collision: MapMetadata,
}

class MapComponent implements Component {
  name = COMPONENT_NAMES.Map;

  public collision: MapMetadata;

  constructor({ collision }: MapComponentMetadata) {
    this.collision = collision;
  }

  getWidth(): number {
    return this.collision[0].length;
  }

  getHeight(): number {
    return this.collision.length;
  }

  getCollision(x: number, y: number): number {
    const tileX = MapComponent.getTilePosition(x);
    const tileY = MapComponent.getTilePosition(y);

    if (
      tileX < 0
      || tileY < 0
      || tileX > this.getWidth() - 1
      || tileY > this.getHeight() - 1
    ) {
      return 0;
    }

    return this.collision[tileY][tileX];
  }

  static getTilePosition(val: number): number {
    return Math.floor(val / TILE_SIZE);
  }
}

export default MapComponent;
