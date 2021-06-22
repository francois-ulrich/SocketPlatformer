import { World } from 'super-ecs';
import { CompositeTilemap } from '@pixi/tilemap';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import MapComponent from '../components/MapComponent';

import solidTile from '../assets/tilemaps/solid.png';

class MapSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
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
          const { collision } = mapComponent;
          const size = 16;

          const tilemap = new CompositeTilemap();

          this.app.stage.addChild(tilemap);

          // Calculate the dimensions of the tilemap to build
          const tilemapWidth = collision[0].length;
          const tilemapHeight = collision.length;

          for (let x = 0; x < tilemapWidth; x++) {
            for (let y = 0; y < tilemapHeight; y++) {
              const collVal = collision[y][x];

              if (collVal == 1) {
                tilemap.tile(
                  solidTile,
                  x * size,
                  y * size,
                  {
                    tileWidth: size,
                    tileHeight: size,
                  },
                );
              }
            }
          }
        }
      });
  }
}

export default MapSystem;
