import { World } from 'super-ecs';
import * as PIXI from 'pixi.js';

import COMPONENT_NAMES from '../components/types';

import MapComponent from '../components/MapComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollisionComponent from '../components/CollisionComponent';
import PositionComponent from '../components/PositionComponent';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

class CollisionSystem extends ExtendedSystem {
    constructor({ app }: ExtendedSystemMetadata) {
        super({ app });
    }

    update(delta: number): void {
        // Get entities under this system
        const mapEntity = this.world.getEntities([
            COMPONENT_NAMES.Map,
        ])[0];

        if (!mapEntity) {
            return;
        }

        const entities = this.world.getEntities([
            COMPONENT_NAMES.Velocity,
            COMPONENT_NAMES.Position,
            COMPONENT_NAMES.Collision,
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

            const positionComponent = entity.getComponent<PositionComponent>(
                COMPONENT_NAMES.Position,
            );

            const collisionComponent = entity.getComponent<CollisionComponent>(
                COMPONENT_NAMES.Collision,
            );

            if (positionComponent
                && collisionComponent
                && velocityComponent) {
                const { x, y } = positionComponent;

                collisionComponent.debugRect.x = x;
                collisionComponent.debugRect.y = y;
            }
        });
    }

    addedToWorld(world: World): void {
        super.addedToWorld(world);

        // Add sprite to stage
        this.disposeBag
            .completable$(
                world.entityAdded$([
                    COMPONENT_NAMES.Collision,
                ]),
            )
            .subscribe((entity) => {
                const collisionComponent = entity.getComponent<CollisionComponent>(
                    COMPONENT_NAMES.Collision,
                );

                if (collisionComponent) {
                    this.app.stage.addChild(collisionComponent.debugRect);
                }
            });

    }
}

export default CollisionSystem;
