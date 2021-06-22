import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';
import { World } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import PlayerComponent from '../components/PlayerComponent';

class PlayerSystem extends ExtendedSystem {
    constructor({ app }: ExtendedSystemMetadata) {
        super({ app });
    }

    // update(delta: number): void {
    update(): void {
        // Get entities under this system
        const entities = this.world.getEntities([
            COMPONENT_NAMES.Player,
        ]);

        // Exit if no entities found
        if (entities.length === 0) {
            return;
        }

        // Loop through all entities
        entities.forEach((entity) => {
            const playerComponent = entity.getComponent<PlayerComponent>(
                COMPONENT_NAMES.Player,
            );

            if (playerComponent) {
                // if (playerComponent.input.right) {
                //     console.log("Input right")
                // }

                // if (playerComponent.input.left) {
                //     console.log("Input left")
                // }
            }
        });
    }

    addedToWorld(world: World): void {
        super.addedToWorld(world);

        // Add sprite to stage
        this.disposeBag
            .completable$(
                world.entityAdded$([
                    COMPONENT_NAMES.Player,
                ]),
            )
            .subscribe((entity) => {
                const playerComponent = entity.getComponent<PlayerComponent>(
                    COMPONENT_NAMES.Player,
                );

                if (playerComponent) {
                    // Event listener for key press
                    document.addEventListener('keydown', (e: KeyboardEvent) => {
                        // Prevent default browser behavior for key press
                        e.preventDefault();

                        playerComponent.input.right = (e.key === "ArrowRight");
                        playerComponent.input.left = (e.key === "ArrowLeft");
                    });

                    // Event listener for key press
                    document.addEventListener('keyup', (e: KeyboardEvent) => {
                        // Prevent default browser behavior for key press
                        e.preventDefault();

                        if (playerComponent.input.right && e.key === "ArrowRight") {
                            playerComponent.input.right = false;
                        }

                        if (playerComponent.input.left && e.key === "ArrowLeft") {
                            playerComponent.input.left = false;
                        }
                    });
                }
            });
    }

}

export default PlayerSystem;
