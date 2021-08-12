import { ExtendedSystem } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

import MapComponent from '../components/MapComponent';
import CharacterComponent from '../components/CharacterComponent';

import normalState from './Character/normalState';

import { CHAR_STATES } from './../global';

// import SpriteComponent from '../components/SpriteComponent';

// type SpriteScaleData = {
//   x?: number,
//   y?: number,
// }

// type SpriteData = {
//   name?: string,
//   scale?: SpriteScaleData
// }

class CharacterSystem extends ExtendedSystem {
  update(delta: number): void {
    // Get entities under this system
    const entities = this.world.getEntities([COMPONENT_NAMES.Character]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Get map entity
    const [mapEntity] = this.world.getEntities([COMPONENT_NAMES.Map]);

    if (!mapEntity) {
      return;
    }

    // Get map component
    const mapComponent = mapEntity.getComponent<MapComponent>(
      COMPONENT_NAMES.Map,
    );

    if (!mapComponent) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
      );

      if (characterComponent) {
        const { state } = characterComponent;

        switch (state) {
          case CHAR_STATES.Normal:
            normalState(entity, mapComponent, delta);
            break;
        }

      }
    });
  }
}

export default CharacterSystem;
