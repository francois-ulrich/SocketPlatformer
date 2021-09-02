export const CLIENT_FPS = 60;

export const TILE_SIZE: number = 16;
export const TILE_STAIR_ASC: number = 2;
export const TILE_STAIR_DESC: number = 1;
export const TICK_RATE: number = 30;
export const KEYS: Array<string> = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'Space'];

// Character data
export const CHARACTER_MAX_XSPEED: number = 1;
export const CHARACTER_JUMP_FORCE: number = 3.8;
export const CHARACTER_STAIRS_SPEED: number = 0.5;

export const enum STAIR_TYPE {
  Asc = 1,
  Desc = -1,
}

export default {};
