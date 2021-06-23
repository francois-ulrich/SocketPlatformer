import { Component } from 'super-ecs';
import * as PIXI from 'pixi.js';

import COMPONENT_NAMES from './types';

type CollisionComponentMetadata = {
    width: number;
    height: number;
}

class CollisionComponent implements Component {
    name = COMPONENT_NAMES.Collision;

    width: number;
    height: number;
    debugRect: PIXI.Graphics;

    constructor({ width = 16, height = 32 }: CollisionComponentMetadata) {
        this.width = width;
        this.height = height;
        this.debugRect = new PIXI.Graphics;
        this.debugRect.beginFill(0x0000FF);
        this.debugRect.drawRect(0, 0, width, height);
    }
}

export default CollisionComponent;
