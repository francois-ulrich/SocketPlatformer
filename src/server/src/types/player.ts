type PlayerStairsData = {
  onStairs: boolean,
  stairsType?: number
}

type PlayerData = {
  clientId: string;
  x?: number;
  y?: number;
  xSpeed?: number;
  ySpeed?: number;
  stairs?: PlayerStairsData
  sprite?: {
    name?: string,
    scale?: {
      x?: number
      y?: number
    }
  }
};

type PlayersList = {
  [key: string]: PlayerData;
};

type PlayerInitMetadata = {
  clientId: string;
  players: PlayersList;
};

export { PlayerData, PlayersList, PlayerInitMetadata, PlayerStairsData };
