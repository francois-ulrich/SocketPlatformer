import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';
import { MapMetadata } from '../types/mapMetadata';

type MapComponentMetadata = {
    collision: MapMetadata,
}

class MapComponent implements Component {
    name = COMPONENT_NAMES.Map;

    public collision: MapMetadata;

    constructor({ collision }: MapComponentMetadata) {
        this.collision = collision;
    }
}

export default MapComponent;
