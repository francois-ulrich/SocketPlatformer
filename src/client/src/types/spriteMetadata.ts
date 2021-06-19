type AnimationMetadata = {
  y: number;
  width: number;
  height: number;
  frames: number;
  frameTime?: number;
};

type SpriteMetadata = {
  sheet: string;
  defaultAnimation: string,
  animations: {
    [index: string]: AnimationMetadata,
  };
};

export { SpriteMetadata, AnimationMetadata };
