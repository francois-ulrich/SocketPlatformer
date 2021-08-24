type MapGridMetadata = Array<Array<number>>;

type MapMetadata = {
    collision: MapGridMetadata,
    tiles: MapGridMetadata | undefined
}

export {
  MapGridMetadata,
  MapMetadata,
};
