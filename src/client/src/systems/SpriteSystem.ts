import { System, World, DisposeBag } from 'super-ecs';
import * as PIXI from 'pixi.js';

type SpriteSystemMetadata = {
  app: PIXI.Application;
};

class SpriteSystem extends System {
    app: PIXI.Application;

    constructor({ app }: SpriteSystemMetadata) {
      super();

      this.app = app;
    }
}

export default SpriteSystem;
