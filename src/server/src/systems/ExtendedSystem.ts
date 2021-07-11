import { System, DisposeBag } from 'super-ecs';

type ExtendedSystemMetadata = {
};

class ExtendedSystem extends System {
  disposeBag: DisposeBag;

  // constructor({ app }: ExtendedSystemMetadata) {
  constructor() {
    super();

    // this.app = app;
    this.disposeBag = new DisposeBag();
  }
}

export {
  ExtendedSystemMetadata,
  ExtendedSystem,
};

// export default ExtendedSystem;
