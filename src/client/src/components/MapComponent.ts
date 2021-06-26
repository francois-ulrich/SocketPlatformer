import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import MapMetadata from '../types/mapMetadata';

import { TILE_SIZE } from '../global';

type MapComponentMetadata = {
    collision: MapMetadata,
}

type PositionMetadata = {
    x: number,
    y: number,
}

type OptionalPositionMetadata = {
    x?: number,
    y?: number,
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

    getCollision({ x, y }: PositionMetadata): number {
      const collPosition = this.getTilePosition({ x, y });

      const { x: collX, y: collY } = collPosition;

      if (
        collX < 0
            || collY < 0
            || collX > this.getWidth() - 1
            || collY > this.getHeight() - 1
      ) {
        // console.log(x, y);
        return 0;
      }

      return this.collision[collPosition.y][collPosition.x];
    }

    getTilePosition({ x = 0, y = 0 }: OptionalPositionMetadata): PositionMetadata {
      return {
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE),
      };
    }

    getTilePositionInWorld({ x = 0, y = 0 }: OptionalPositionMetadata): PositionMetadata {
      const result: PositionMetadata = this.getTilePosition({ x, y });

      if (result.x != null) { result.x *= TILE_SIZE; }

      if (result.y != null) { result.y *= TILE_SIZE; }

      return result;
    }
}

export default MapComponent;
