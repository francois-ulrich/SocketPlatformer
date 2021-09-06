import { World } from 'super-ecs';

import COMPONENT_NAMES from '../components/types';
import MapComponent from '../components/MapComponent';

function getMapComponent(world: World): MapComponent|undefined {
  const [mapEntity] = world.getEntities([COMPONENT_NAMES.Map]);

  if (!mapEntity) {
    return undefined;
  }

  // Get map component
  const mapComponent = mapEntity.getComponent<MapComponent>(
    COMPONENT_NAMES.Map,
  );

  return mapComponent;
}

export default getMapComponent;
