type PlayerData = {
  clientId: string;
  x: number;
  y: number;
};

type PlayersList = {
  [key: string]: PlayerData;
};

export {
  PlayerData,
  PlayersList,
};
