import { World } from 'super-ecs';
import * as PIXI from 'pixi.js';

import { ExtendedSystem, ExtendedSystemMetadata } from './ExtendedSystem';

class CollisionSystem extends ExtendedSystem {
    constructor({ app }: ExtendedSystemMetadata) {
        super({ app });
    }

    // update(delta: number): void {
    update(): void {
        // Get entities under this system
        // const entities = this.world.getEntities([
        //     COMPONENT_NAMES.Collision,
        // ]);
    }

    addedToWorld(world: World): void {
        super.addedToWorld(world);

        // // Add sprite to stage
        // this.disposeBag
        //   .completable$(
        //     world.entityAdded$([
        //       COMPONENT_NAMES.Collision,
        //       COMPONENT_NAMES.Sprite,
        //     ]),
        //   )
        //   .subscribe((entity) => {
        //     const spriteComponent = entity.getComponent<SpriteComponent>(
        //       COMPONENT_NAMES.Sprite,
        //     );

        //     if (spriteComponent) {
        //       // const { sprite } = spriteComponent;
        //       // sprite.Sprite.set(SpriteComponent.x, SpriteComponent.y);

        //     }
        //   });

        // this.disposeBag
        //   .completable$(
        //     world.entityRemoved$([
        //       COMPONENT_NAMES.Collision,
        //       COMPONENT_NAMES.Sprite,
        //     ]),
        //   )
        //   .subscribe((entity) => {
        //     const sprite = entity.getComponent(COMPONENT_NAMES.Sprite);

        //     if (sprite) {
        //       this.app.stage.removeChild(sprite.object);
        //     }
        //   });
        //   }
    }
}

export default CollisionSystem;
