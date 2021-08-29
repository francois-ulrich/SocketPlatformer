import { World } from 'super-ecs';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

import COMPONENT_NAMES from '../components/types';

// Components
import SpriteComponent from '../components/SpriteComponent';

class CharacterSystem extends ExtendedSystem {
  constructor({ app }: ExtendedSystemMetadata) {
    super({ app });
  }

  // update(delta: number): void {

  // }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([COMPONENT_NAMES.Character, COMPONENT_NAMES.Sprite]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        // Set initial sprite
        spriteComponent?.setAnimation('idle');
      });
  }
}

export default CharacterSystem;
