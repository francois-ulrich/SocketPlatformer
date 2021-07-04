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

  getMapCollisionLine(
    xStart: number,
    yStart: number,
    length: number,
    horizontal: boolean,
  ): boolean {
    // Get number of collisions needed to be checked
    const collsNb: number = Math.max(2, Math.floor(length / TILE_SIZE) + 1);
    const gap = length / Math.ceil(length / TILE_SIZE);

    const colls: Array<number> = [];

    // Check every collisions
    for (let i = 0; i < collsNb; i += 1) {
      let checkX: number;
      let checkY: number;

      // Vertical line
      if (horizontal) {
        checkX = xStart + i * gap - (i === collsNb - 1 ? 1 : 0);
        checkY = yStart;
      } else {
        checkX = xStart;
        checkY = yStart + i * gap - (i === collsNb - 1 ? 1 : 0);
      }

      colls.push(this.getCollision(checkX, checkY));
    }

    // If no collision found, just return false
    return colls.includes(1);
  }
}

export default MapComponent;
