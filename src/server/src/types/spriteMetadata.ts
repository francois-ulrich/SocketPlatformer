type AnimationMetadata = {
  y: number;
  width: number;
  height: number;
  frames?: number;
  frameTime?: number;
  loop?: boolean;
};

type SpriteMetadata = {
  defaultAnimation: string;
  animations: Record<string, AnimationMetadata>;
};

export { SpriteMetadata, AnimationMetadata };
