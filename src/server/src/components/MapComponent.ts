import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import { MapMetadata, MapGridMetadata } from '../types/mapMetadata';
import { PositionMetadata } from '../types/positionMetadata';

import { TILE_SIZE, TILE_STAIR_ASC, TILE_STAIR_DESC } from '../global';

type collisionMetadata = {
  x: number,
  y: number,
  collision: number,
}

type StairX = number | null;

class MapComponent implements Component {
  public name: symbol = COMPONENT_NAMES.Map;

  public collision: MapGridMetadata;

  public tiles?: MapGridMetadata;

  public stairs?: MapGridMetadata;

  constructor({ collision, tiles, stairs }: MapMetadata) {
    this.collision = collision;
    this.tiles = tiles;
    this.stairs = stairs;
  }

  getWidth(): number {
    return this.collision[0].length;
  }

  getHeight(): number {
    return this.collision.length;
  }

  getPositionInBound(x: number, y: number): boolean {
    return x >= 0
      && y >= 0
      && x < this.getWidth()
      && y < this.getHeight();
  }

  getCollision(x: number, y: number): number {
    if (!this.getPositionInBound(x, y)) {
      return 0;
    }

    return this.collision[y][x];
  }

  static getTilePosition(val: number): number {
    return Math.floor(val / TILE_SIZE);
  }

  getMapCollisionLineData(
    xStart: number,
    yStart: number,
    length: number,
    horizontal: boolean,
  ): Array<collisionMetadata> {
    if (length <= 0) { return []; }

    // Get number of collisions needed to be checked
    const collsNb: number = Math.max(2, Math.floor(length / TILE_SIZE) + 1);
    const gap: number = length / Math.ceil(length / TILE_SIZE);

    const colls: Array<collisionMetadata> = [];

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
        collision: this.getCollision(
          MapComponent.getTilePosition(checkX),
          MapComponent.getTilePosition(checkY),
        ),
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

  getMapCollisionRectData(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Array<collisionMetadata> {
    const res: Array<collisionMetadata> = [];

    // Get number of collisions needed to be checked
    const collsNbHor: number = Math.max(
      1,
      Math.ceil(width / TILE_SIZE) + (x % TILE_SIZE === 0 ? 0 : 1),
    );
    const collsNbVer: number = Math.max(
      1,
      Math.ceil(height / TILE_SIZE) + (y % TILE_SIZE === 0 ? 0 : 1),
    );

    // console.log({ collsNbHor, collsNbVer });

    const gap = {
      width: width / Math.ceil(width / TILE_SIZE),
      height: height / Math.ceil(height / TILE_SIZE),
    };

    for (let yy = 0; yy < collsNbVer; yy += 1) {
      for (let xx = 0; xx < collsNbHor; xx += 1) {
        const check: PositionMetadata = {
          x: MapComponent.getTilePosition(
            x + gap.width * xx,
          ),
          y: MapComponent.getTilePosition(
            y + gap.height * yy,
          ),
        };

        const collValue = this.getCollision(check.x, check.y);

        if (this.getPositionInBound(check.x, check.y)
          && collValue > 0) {
          const newColl = { ...check, collision: collValue };

          res.push(newColl);
        }
      }
    }

    // console.log(res);

    return res;
  }

  getMapCollisionRect(
    x: number,
    y: number,
    width: number,
    height: number,
    dir: string,
  ): PositionMetadata | null {
    const collData = this.getMapCollisionRectData(x, y, width, height);

    if (collData.length === 0) { return null; }

    if (collData.length > 1) {
      switch (dir) {
        case 'up':
          collData.sort((a, b) => b.y - a.y);

          break;
        case 'down':
          collData.sort((a, b) => a.y - b.y);

          break;
        case 'left':
          collData.sort((a, b) => b.x - a.x);

          break;
        case 'right':
          collData.sort((a, b) => a.x - b.x);

          break;
        default:
          break;
      }
    }

    const collResult = collData[0];

    const res = collResult ? {
      x: collResult.x,
      y: collResult.y,
    } : null;

    return res;
  }

  getStairVal(x: number, y: number): number {
    if (!this.stairs) { return 0; }

    return this.stairs[MapComponent.getTilePosition(y)][MapComponent.getTilePosition(x)];
  }

  getStairX(x: number, y: number): StairX {
    const stairVal: number = this.getStairVal(x, y);

    switch (stairVal) {
      case TILE_STAIR_ASC:
        return MapComponent.getTilePosition(x) * TILE_SIZE;

      case TILE_STAIR_DESC:
        return MapComponent.getTilePosition(x) * TILE_SIZE + TILE_SIZE;

      default:
        return null;
    }
  }

  getNearestStairsX(x: number, y: number): Array<number> {
    const checkTileXStart = MapComponent.getTilePosition(x) - 1;
    const checkTileXEnd = checkTileXStart + 3;

    const checkTileY = MapComponent.getTilePosition(y);

    const posList: Array<number> = [];

    for (let checkX = checkTileXStart;
      checkX < checkTileXEnd;
      checkX += 1) {
      const checkPos: PositionMetadata = {
        x: checkX,
        y: checkTileY,
      };

      // Skip check if X is out of bounds
      if (!this.getPositionInBound(checkPos.x, checkPos.y)) {
        // continue;
        checkX += 1;
      }

      const currentStairX: StairX = this.getStairX(
        checkPos.x * TILE_SIZE,
        checkPos.y * TILE_SIZE,
      );

      if (currentStairX) {
        posList.push(currentStairX);
      }
    }

    return posList;
  }

  getNearestStairX(x: number, y: number): StairX {
    const stairsX: Array<number> = this.getNearestStairsX(x, y);

    return stairsX.length === 0
      ? null
      : stairsX.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
  }
}

export default MapComponent;
