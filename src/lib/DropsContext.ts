import { createContext } from 'react';

import { Drop, DropRequest } from '../api/types';

export interface DropsContextProps {
  drops: Drop[];
  createDrop: (drop: DropRequest) => Promise<Drop | null>;
  getDrops: () => void;
  updateDrop: (dropId: string, preDrop: Drop, newDrop: Drop) => void;
  deleteDrop: (dropId: string) => void;
}

export const DropsContext = createContext<DropsContextProps | null>(null);
