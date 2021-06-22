import { World } from 'super-ecs';
import * as PIXI from 'pixi.js';

import COMPONENT_NAMES from '../components/types';

import MapComponent from '../components/MapComponent';
import VelocityComponent from '../components/VelocityComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

class CollisionSystem extends ExtendedSystem {
    constructor({ app }: ExtendedSystemMetadata) {
        super({ app });
    }

    update(delta: number): void {
        // Get entities under this system
        const mapEntity = this.world.getEntities([
            COMPONENT_NAMES.Velocity,
        ])[0];

        if (!mapEntity) {
            return;
        }

        const entities = this.world.getEntities([
            COMPONENT_NAMES.Velocity,
        ]);

        // Get map component
        const mapComponent = mapEntity.getComponent<MapComponent>(
            COMPONENT_NAMES.Map,
        );

        // Loop through all entities
        entities.forEach((entity) => {
            const velocityComponent = entity.getComponent<VelocityComponent>(
                COMPONENT_NAMES.Velocity,
            );

            if (mapComponent && velocityComponent) {
                
            }
        });
    }
}

export default CollisionSystem;
