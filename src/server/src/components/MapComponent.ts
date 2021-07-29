import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import { MapMetadata, MapGridMetadata } from '../../../shared/src/types/mapMetadata';
import { PositionMetadata } from '../types/positionMetadata';

import { TILE_SIZE } from '../../../shared/src/global';

type collisionMetadata = {
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
    return x >= 0
      && y >= 0
      && x < this.getWidth() - 1
      && y < this.getHeight() - 1;
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

  // getMapCollisionRect(
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number,
  // ): PositionMetadata | null {
  //   console.log({
  //     x1: x,
  //     y1: y,
  //     x2: x + width,
  //     y2: y + height,
  //   });

  //   const horColls = this.getMapCollisionLineData(x, y, width, true);

  //   console.log("horColls");
  //   console.log(horColls);

  //   for (let i = 0; i < horColls.length; i += 1) {
  //     const coll = horColls[i];

  //     const verColls = this.getMapCollisionLineData(
  //       coll.x,
  //       coll.y,
  //       height,
  //       false,
  //     );

  //     const verSolidColls = verColls.filter((el) => el.collision > 0);

  //     if (verSolidColls.length > 0) {
  //       // console.log(x, y);
  //       // console.log(MapComponent.getTilePosition(x), MapComponent.getTilePosition(y));
  //       const result = {
  //         x: MapComponent.getTilePosition(verSolidColls[0].x),
  //         y: MapComponent.getTilePosition(verSolidColls[0].y),
  //       };

  //       // console.log("colliding");

  //       return result;
  //     }

  //     // verColls.forEach((verColl) => {
  //     //   if(vercoll)
  //     // });
  //   }

  //   return null;
  // }

  getMapCollisionRectData(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Array<collisionMetadata> {
    const res: Array<collisionMetadata> = [];

    // Get number of collisions needed to be checked
    const collsNbHor: number = Math.max(2, Math.floor(width / TILE_SIZE) + 1);
    const collsNbVer: number = Math.max(2, Math.floor(height / TILE_SIZE) + 1);

    console.log(collsNbHor, collsNbVer);

    const start: PositionMetadata = {
      x: Math.floor(x / TILE_SIZE),
      y: Math.floor(y / TILE_SIZE),
    };

    for (let yy = 0; yy < collsNbVer; yy += 1) {
      for (let xx = 0; xx < collsNbHor; xx += 1) {
        const check: PositionMetadata = {
          x: start.x + xx,
          y: start.y + yy,
        };

        const collValue = this.getCollision(check.x, check.y);

        if (this.getPositionInBound(check.x, check.y)
          && collValue > 0) {
          res.push({ ...check, collision: collValue });
        }
      }
    }

    return res;
  }

  getMapCollisionRect(
    x: number,
    y: number,
    width: number,
    height: number,
  ): PositionMetadata | null {
    const w: number = width - 1;
    const h: number = height - 1;

    // Get number of collisions needed to be checked
    const collsNbHor: number = Math.max(2, Math.floor(width / TILE_SIZE) + 1);
    const collsNbVer: number = Math.max(2, Math.floor(height / TILE_SIZE) + 1);

    const gapHor: number = w / Math.ceil(width / TILE_SIZE);
    const gapVer: number = h / Math.ceil(height / TILE_SIZE);

    // const colls: Array<collisionMetadata> = [];

    for (let yy = 0; yy < collsNbVer; yy += 1) {
      for (let xx = 0; xx < collsNbHor; xx += 1) {
        const check: PositionMetadata = {
          x: MapComponent.getTilePosition(x + gapHor * xx),
          y: MapComponent.getTilePosition(y + gapVer * yy),
        };

        if (this.getPositionInBound(check.x, check.y)
          && this.getCollision(check.x, check.y) > 0) {
          return check;
        }
      }
    }

    return null;
  }

  // // Check every collisions
  // for (let i = 0; i < collsNb; i += 1) {
  //   let checkX: number;
  //   let checkY: number;

  //   // Vertical line
  //   if (horizontal) {
  //     checkX = xStart + i * gap - (i === collsNb - 1 ? 1 : 0);
  //     checkY = yStart;
  //   } else {
  //     checkX = xStart;
  //     checkY = yStart + i * gap - (i === collsNb - 1 ? 1 : 0);
  //   }

  //   colls.push({
  //     x: checkX,
  //     y: checkY,
  //     collision: this.getCollision(checkX, checkY),
  //   });

  //   return null;
  // }

  // getNearestWallTilePos(
  //   x: number,
  //   y: number,
  //   direction: string,
  //   collFree?: boolean,
  // ): PositionMetadata | null {
  //   const checkPos: PositionMetadata = {
  //     x: MapComponent.getTilePosition(x),
  //     y: MapComponent.getTilePosition(y),
  //   };

  //   let xShift: number = 0;
  //   let yShift: number = 0;

  //   if (collFree) {
  //     switch (direction) {
  //       case 'right':
  //         xShift = 1;
  //         break;
  //       case 'left':
  //         xShift = -1;
  //         break;
  //       case 'down':
  //         yShift = 1;
  //         break;
  //       case 'up':
  //         yShift = -1;
  //         break;
  //       default:
  //         break;
  //     }
  //   }

  //   while (this.getPositionInBound(checkPos.x + xShift, checkPos.y + yShift)) {
  //     switch (direction) {
  //       case 'right':
  //         checkPos.x += 1;
  //         break;
  //       case 'left':
  //         checkPos.x -= 1;
  //         break;
  //       case 'down':
  //         checkPos.y += 1;
  //         break;
  //       case 'up':
  //         checkPos.y -= 1;
  //         break;
  //       default:
  //         break;
  //     }

  //     const currentColl = this.getCollision(
  //       checkPos.x + xShift,
  //       checkPos.y + yShift,
  //     );

  //     console.log(currentColl);

  //     if (currentColl === 1) {
  //       return {
  //         x: checkPos.x,
  //         y: checkPos.y,
  //       };
  //     }
  //   }

  //   return null;
  // }
}

export default MapComponent;
