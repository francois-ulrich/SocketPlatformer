import { World } from 'super-ecs';
import { CompositeTilemap } from '@pixi/tilemap';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
// import MapComponent from '../components/MapComponent';
import MapComponent from '../components/MapComponent';

import solidTile from '../assets/tilemaps/solid.png';
import stairsATile from '../assets/tilemaps/stairsA.png';
import stairsDTile from '../assets/tilemaps/stairsD.png';

import { TILE_SIZE } from '../global';

class MapSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add map tiles to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Map,
        ]),
      )
      .subscribe((entity) => {
        const mapComponent = entity.getComponent<MapComponent>(
          COMPONENT_NAMES.Map,
        );

        if (mapComponent) {
          const { collision, stairs } = mapComponent;

          const tilemap = new CompositeTilemap();

          this.app.stage.addChild(tilemap);

          // Calculate the dimensions of the tilemap to build
          const tilemapWidth = collision[0].length;
          const tilemapHeight = collision.length;

          for (let x = 0; x < tilemapWidth; x += 1) {
            for (let y = 0; y < tilemapHeight; y += 1) {
              const collVal: number = collision[y][x];

              if (collVal === 1) {
                tilemap.tile(
                  solidTile,
                  x * TILE_SIZE,
                  y * TILE_SIZE,
                  {
                    tileWidth: TILE_SIZE,
                    tileHeight: TILE_SIZE,
                  },
                );
              }
            }
          }

          // Stairs layer
          if (stairs) {
            // Place stairs tiles
            for (let x = 0; x < tilemapWidth; x += 1) {
              for (let y = 0; y < tilemapHeight; y += 1) {
                const stairVal: number = stairs[y][x];

                if (stairVal > 0) {
                  tilemap.tile(
                    stairVal === 2 ? stairsATile : stairsDTile,
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    {
                      tileWidth: TILE_SIZE,
                      tileHeight: TILE_SIZE,
                    },
                  );
                }
              }
            }
          }
        }
      });
  }
}

export default MapSystem;
