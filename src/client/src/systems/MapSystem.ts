import { World } from 'super-ecs';
// import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import MapComponent from '../components/MapComponent';

class MapSystem extends ExtendedSystem {
    constructor({ app }: ExtendedSystemMetadata) {
        super({ app });
    }

    // update(delta: number): void {
    update(): void {
        // Get entities under this system
        const entities = this.world.getEntities([
            COMPONENT_NAMES.Map,
        ]);

        // Exit if no entities found
        if (entities.length === 0) {
            return;
        }

        // Loop through all entities
        entities.forEach((entity) => {
            const mapComponent = entity.getComponent<MapComponent>(
                COMPONENT_NAMES.Map,
            );
        });
    }

    addedToWorld(world: World): void {
        super.addedToWorld(world);

        // Add sprite to stage
        this.disposeBag
            .completable$(
                world.entityAdded$([
                    COMPONENT_NAMES.Map,
                    COMPONENT_NAMES.Sprite,
                ]),
            )
            .subscribe((entity) => {
                const mapComponent = entity.getComponent<MapComponent>(
                    COMPONENT_NAMES.Map,
                );

                if (mapComponent) {
                    // Draw the map
                }
            });
    }
}

export default MapSystem;
