import sheet from './sheet.png';
import { SpriteMetadata } from '../../../types/spriteMetadata';

const spriteData: SpriteMetadata = {
  sheet,
  defaultAnimation: 'idle',
  animations: {
    idle: {
      y: 0,
      width: 16,
      height: 32,
      frames: 1,
    },
    walk: {
      y: 32,
      width: 16,
      height: 32,
      frames: 4,
      frameTime: 5,
    },
  },
};

export default spriteData;
