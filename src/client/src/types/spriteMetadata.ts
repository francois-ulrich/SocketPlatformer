type AnimationMetadata = {
  y: number;
  width: number;
  height: number;
  frames?: number;
  frameTime?: number;
  loop?: boolean;
};

type SpriteMetadata = {
  src: string;
  defaultAnimation: string,
  animations: {
    [index: string]: AnimationMetadata,
  };
};

export { SpriteMetadata, AnimationMetadata };
