import { Entity } from 'super-ecs';

type ClientsListMetadata = {
    [key: string]: {
        entity: Entity
    };
}

export default ClientsListMetadata;
