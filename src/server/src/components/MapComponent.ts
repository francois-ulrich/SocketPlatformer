import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import { MapMetadata, MapGridMetadata } from '../../../shared/src/types/mapMetadata';
import { PositionMetadata } from '../types/positionMetadata';

import { TILE_SIZE } from '../../../shared/src/global';

type collisionVectorData = {
  x: number,
  y: number,
  collision: number,
}

class MapComponent implements Component {
  public name: symbol = COMPONENT_NAMES.Map;

  public collision: MapGridMetadata;

  public tiles: MapGridMetadata | undefined;

  constructor({ collision, tiles }: MapMetadata) {
    this.collision = collision;
    this.tiles = tiles;
  }

  getWidth(): number {
    return this.collision[0].length;
  }

  getHeight(): number {
    return this.collision.length;
  }

  getPositionInBound(x: number, y: number): boolean {
    return x >= 0 || y >= 0 || x < this.getWidth() || y < this.getHeight();
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

  getMapCollisionLineData(
    xStart: number,
    yStart: number,
    length: number,
    horizontal: boolean,
  ): Array<collisionVectorData> {
    if (length <= 0)
      return [];

    // Get number of collisions needed to be checked
    const collsNb: number = Math.max(2, Math.floor(length / TILE_SIZE) + 1);
    const gap: number = length / Math.ceil(length / TILE_SIZE);

    const colls: Array<collisionVectorData> = [];

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

      colls.push({
        x: checkX,
        y: checkY,
        collision: this.getCollision(checkX, checkY),
      });
    }

    // If no collision found, just return false
    return colls;
  }

  getMapCollisionLine(
    xStart: number,
    yStart: number,
    length: number,
    horizontal: boolean,
  ): boolean {
    const collData = this.getMapCollisionLineData(
      xStart,
      yStart,
      length,
      horizontal,
    );

    return collData.filter((el) => el.collision > 0).length > 0;
  }

  getMapCollisionRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): PositionMetadata | null {
    const horColls = this.getMapCollisionLineData(x, y, width, true);

    for (let i = 0; i < horColls.length; i += 1) {
      const coll = horColls[i];

      const verColls = this.getMapCollisionLineData(
        coll.x,
        coll.y,
        height,
        false,
      );

      const verSolidColls = verColls.filter((el) => el.collision > 0);

      if (verSolidColls.length > 0) {
        // console.log(x, y);
        // console.log(MapComponent.getTilePosition(x), MapComponent.getTilePosition(y));

        return {
          x: MapComponent.getTilePosition(verSolidColls[0].x),
          y: MapComponent.getTilePosition(verSolidColls[0].y),
        };
      }

      // verColls.forEach((verColl) => {
      //   if(vercoll)
      // });
    }

    return null;
  }

  getNearestWallTilePos(
    x: number,
    y: number,
    direction: string,
    collFree?: boolean,
  ): PositionMetadata | null {
    const checkPos: PositionMetadata = {
      x: MapComponent.getTilePosition(x),
      y: MapComponent.getTilePosition(y),
    };

    let xShift: number = 0;
    let yShift: number = 0;

    if (collFree) {
      switch (direction) {
        case 'right':
          xShift = 1;
          break;
        case 'left':
          xShift = -1;
          break;
        case 'down':
          yShift = 1;
          break;
        case 'up':
          yShift = -1;
          break;
        default:
          break;
      }
    }

    while (this.getPositionInBound(checkPos.x + xShift, checkPos.y + yShift)) {
      switch (direction) {
        case 'right':
          checkPos.x += 1;
          break;
        case 'left':
          checkPos.x -= 1;
          break;
        case 'down':
          checkPos.y += 1;
          break;
        case 'up':
          checkPos.y -= 1;
          break;
        default:
          break;
      }

      const currentColl = this.getCollision(
        checkPos.x + xShift,
        checkPos.y + yShift,
      );

      console.log(currentColl);

      if (currentColl === 1) {
        return {
          x: checkPos.x,
          y: checkPos.y,
        };
      }
    }

    return null;
  }
}

export default MapComponent;
