import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react';

import { RareColor, RareColorRequest } from '../api/types';

export interface RareContextProps {
  rareDrops: Map<string, string>;
  setRareDrops: Dispatch<SetStateAction<Map<string, string>>>;
  getRareDrops: () => void;
  createRareDrop: (ship: string, id: string) => void;
  colorsDrops: Map<string, string[]>;
  rareColors: Map<string, RareColor>;
  createRareColor: (req: RareColorRequest) => void;
  getColor: (id?: string) => RareColor;
  getColorByShip: (ship?: string) => RareColor;
  updateRareColor: (id: string, req: RareColorRequest) => void;
  deleteRareDrop: (ship: string) => void;
}

export const RareContext = createContext<RareContextProps | null>(null);
