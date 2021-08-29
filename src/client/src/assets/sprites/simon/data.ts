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
    },
    jump: {
      y: 64,
      width: 16,
      height: 32,
      frames: 2,
      loop: false,
    },
    stairsAsc: {
      y: 96,
      width: 16,
      height: 32,
      frames: 2,
    },
    stairsDesc: {
      y: 128,
      width: 16,
      height: 32,
      frames: 2,
    },
  },
};

export default sheetData;
