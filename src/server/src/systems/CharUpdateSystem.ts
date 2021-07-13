import { World } from 'super-ecs';

import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';
import CharacterComponent from '../components/CharacterComponent';

class CharUpdateSystem extends ExtendedSystem {
    // update(delta: number): void {
    update(): void {
        // Get entities under this system
        const entities = this.world.getEntities([
            COMPONENT_NAMES.Character,
        ]);

        // Exit if no entities found
        if (entities.length === 0) {
            return;
        }

        // Loop through all entities
        entities.forEach((entity) => {
            const characterComponent = entity.getComponent<CharacterComponent>(
                COMPONENT_NAMES.Character,
            );
        });


    }
}

export default CharUpdateSystem;
