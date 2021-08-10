type MapGridMetadata = Array<Array<number>>;

type MapMetadata = {
    collision: MapGridMetadata,
    tiles?: MapGridMetadata
    stairs?: MapGridMetadata
}

export {
    MapGridMetadata,
    MapMetadata
};
