import { Component } from 'super-ecs';

import COMPONENT_NAMES from './types';

type CollisionComponentMetadata = {
    width: number;
    height: number;
}

class CollisionComponent implements Component {
    name = COMPONENT_NAMES.Collision;

    width: number;
    height: number;

    constructor({ width = 16, height = 32 }: CollisionComponentMetadata) {
        this.width = width;
        this.height = height;
    }
}

export default CollisionComponent;
