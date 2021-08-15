export const CLIENT_FPS = 60;

export const TILE_SIZE: number = 16;
export const TILE_STAIR_ASC: number = 2;
export const TILE_STAIR_DESC: number = 1;
export const TICK_RATE: number = 20;
export const KEYS: Array<string> = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Space'];

// export const enum CHAR_STATES {
//     Normal,
//     OnStairs,
// }

export const enum STAIR_TYPE {
  Asc = 1,
  Desc = -1,
}

export default {};
