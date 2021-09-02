import { Entity } from 'super-ecs';

// ECS Types
import COMPONENT_NAMES from '../components/types';

// ECS Components
import StairsComponent from '../components/StairsComponent';
import GravityComponent from '../components/GravityComponent';
import VelocityComponent from '../components/VelocityComponent';
import CollisionComponent from '../components/CollisionComponent';
import PositionComponent from '../components/PositionComponent';
import CharacterComponent from '../components/CharacterComponent';

function setPlayerEntityOnStairs(entity: Entity, value: boolean, stairType?: number): void {
    const velocityComponent = entity.getComponent<VelocityComponent>(
        COMPONENT_NAMES.Velocity,
    );

    const positionComponent = entity.getComponent<PositionComponent>(
        COMPONENT_NAMES.Position,
    );

    const characterComponent = entity.getComponent<CharacterComponent>(
        COMPONENT_NAMES.Character,
    );

    const stairsComponent = entity.getComponent<StairsComponent>(
        COMPONENT_NAMES.Stairs,
    );

    if (value && stairType !== undefined) {
        if (!stairsComponent
            && velocityComponent
            && positionComponent
            && characterComponent
        ) {
            // Add stairs component
            const newStairsComponent = new StairsComponent();
            newStairsComponent.stairType = stairType;
            // Add stairs component
            entity.addComponent(newStairsComponent);

            velocityComponent.xSpeed = 0;
            velocityComponent.ySpeed = 0;
        }

        // Remove gravity component
        entity.removeComponent(COMPONENT_NAMES.Gravity);
        entity.removeComponent(COMPONENT_NAMES.Collision);
    } else {
        // Remove stairs component cuz left stars & s'all good
        entity.removeComponent(COMPONENT_NAMES.Stairs);

        // Add components
        entity.addComponent(new GravityComponent());
        entity.addComponent(new CollisionComponent());
    }
}

export default setPlayerEntityOnStairs;