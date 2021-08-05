import { System, World, DisposeBag } from 'super-ecs';
import * as PIXI from 'pixi.js';

type ExtendedSystemMetadata = {
  app: PIXI.Application;
};

class ExtendedSystem extends System {
  disposeBag: DisposeBag;

  app: PIXI.Application;

  constructor({ app }: ExtendedSystemMetadata) {
    super();

    this.app = app;
    this.disposeBag = new DisposeBag();
  }

  removedFromWorld(world: World): void {
    super.removedFromWorld(world);
    if (this.disposeBag) {
      this.disposeBag.dispose();
    }
  }
}

export {
  ExtendedSystemMetadata,
  ExtendedSystem,
};
