type PlayerData = {
  clientId: string;
  x: number;
  y: number;
  xNext: number;
  yNext: number;
  sprite?: {
    name?:string,
    scale?: {
      x?:number
      y?:number
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

export { PlayerData, PlayersList, PlayerInitMetadata };
