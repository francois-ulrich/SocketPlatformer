import { System, World, DisposeBag } from 'super-ecs';
import * as PIXI from 'pixi.js';

import COMPONENT_NAMES from '../components/types';
import PositionComponent from '../components/PositionComponent';
import SpriteComponent from '../components/SpriteComponent';

type PositionSystemMetadata = {
  app: PIXI.Application;
};

class PositionSystem extends System {
  disposeBag: DisposeBag;

  app: PIXI.Application;

  constructor({ app }: PositionSystemMetadata) {
    super();

    this.app = app;
    this.disposeBag = new DisposeBag();
  }

  // update(delta: number): void {
  update(): void {
    // Get entities under this system
    const entities = this.world.getEntities([
      COMPONENT_NAMES.Position,
      COMPONENT_NAMES.Sprite,
    ]);

    // Exit if no entities found
    if (entities.length === 0) {
      return;
    }

    // Loop through all entities
    entities.forEach((entity) => {
      const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
      );

      const spriteComponent = entity.getComponent<SpriteComponent>(
        COMPONENT_NAMES.Sprite,
      );

      if (positionComponent && spriteComponent) {
        const { object } = spriteComponent;
        object.position.set(positionComponent.x, positionComponent.y);
      }
    });
  }

  addedToWorld(world: World): void {
    super.addedToWorld(world);

    // Add sprite to stage
    this.disposeBag
      .completable$(
        world.entityAdded$([
          COMPONENT_NAMES.Position,
          COMPONENT_NAMES.Sprite,
        ]),
      )
      .subscribe((entity) => {
        const spriteComponent = entity.getComponent<SpriteComponent>(
          COMPONENT_NAMES.Sprite,
        );

        if (spriteComponent) {
          // const { sprite } = spriteComponent;
          // sprite.Sprite.set(SpriteComponent.x, SpriteComponent.y);

          this.app.stage.addChild(spriteComponent.object);
        }
      });

    // this.disposeBag
    //   .completable$(
    //     world.entityRemoved$([
    //       COMPONENT_NAMES.Position,
    //       COMPONENT_NAMES.Sprite,
    //     ]),
    //   )
    //   .subscribe((entity) => {
    //     const sprite = entity.getComponent(COMPONENT_NAMES.Sprite);

    //     if (sprite) {
    //       this.app.stage.removeChild(sprite.object);
    //     }
    //   });
  }
}

export default PositionSystem;
