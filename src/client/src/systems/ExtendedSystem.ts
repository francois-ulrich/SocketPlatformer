import { System, DisposeBag } from 'super-ecs';
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
}

export {
  ExtendedSystemMetadata,
  ExtendedSystem,
};
