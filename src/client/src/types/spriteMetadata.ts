declare type SpriteMetadata = {
  sheet: string;
  animations: {
    [index: string]: {
      y: number;
      width: number;
      height: number;
      frames: number;
    };
  };
};

export default SpriteMetadata;
