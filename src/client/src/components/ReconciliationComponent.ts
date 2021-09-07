import { Component } from 'super-ecs';
import COMPONENT_NAMES from './types';

import { PlayerData } from '../../../server/src/types/player';

type InputMap = {
  [key: string]: boolean;
};

type PlayerState = {
  timestamp: number;
  delta: number;
  input: InputMap;
} & PlayerData;

class ReconciliationComponent implements Component {
  name = COMPONENT_NAMES.Reconciliation;

  public pastStates: Array<PlayerState>;

  constructor() {
    this.pastStates = [];
  }
}

export default ReconciliationComponent;
