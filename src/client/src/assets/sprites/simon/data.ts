import src from './sheet.png';
import { SpriteMetadata } from '../../../types/spriteMetadata';

const sheetData: SpriteMetadata = {
  src,
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
      // frameTime: 0.15,
    },
    jump: {
      y: 64,
      width: 16,
      height: 32,
      frames: 2,
      loop: false,
      // frameTime: 0.5,
    },
    stairsAsc: {
      y: 96,
      width: 16,
      height: 32,
      frames: 2,
      // frameTime: 0.1,
    },
    stairsDesc: {
      y: 128,
      width: 16,
      height: 32,
      frames: 2,
      // frameTime: 0.1,
    },
  },
};

export default sheetData;
