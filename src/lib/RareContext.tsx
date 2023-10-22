import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { createRareDrop } from '../api/createRareDrop';
import { getRareDrops } from '../api/getRareDrops';

interface RareContextProps {
  rareDrops: Map<string, string>;
  setRareDrops: Dispatch<SetStateAction<Map<string, string>>>;
  fetchRareDrops: (user: User | null, firestore: Firestore) => void;
  addRareDrop: (
    user: User | null,
    firestore: Firestore,
    ship: string,
    rare: string
  ) => void;
  colorsDrops: Map<string, string[]>;
}

const RareContext = createContext<RareContextProps | null>(null);

export const RareProvider = ({ children }: { children: JSX.Element }) => {
  const [rareDrops, setRareDrops] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [colorsDrops, setColorsDrops] = useState<Map<string, string[]>>(
    new Map<string, string[]>()
  );

  const groupShipsByColor = (drops: Map<string, string>) => {
    const colorsDrops = new Map<string, string[]>();
    drops.forEach((color, ship) => {
      if (colorsDrops.has(color)) {
        colorsDrops.get(color)?.push(ship);
      } else {
        colorsDrops.set(color, [ship]);
      }
    });
    return colorsDrops;
  };

  const fetchRareDrops = async (user: User | null, firestore: Firestore) => {
    if (!user) return;

    const drops = await getRareDrops(user, firestore);
    setRareDrops(drops.results);
    setColorsDrops(() => groupShipsByColor(drops.results));
  };

  const addRareDrop = async (
    user: User | null,
    firestore: Firestore,
    ship: string,
    rare: string
  ) => {
    if (!user) return;
    const drops = await createRareDrop(user, firestore, ship, rare);
    setRareDrops(drops.results);
    setColorsDrops(() => groupShipsByColor(drops.results));
  };

  return (
    <RareContext.Provider
      value={{
        rareDrops,
        setRareDrops,
        fetchRareDrops,
        addRareDrop,
        colorsDrops,
      }}
    >
      {children}
    </RareContext.Provider>
  );
};

export const useRareContext = (): RareContextProps => {
  const context = useContext(RareContext);
  if (!context) {
    throw new Error('useRareContext must be used within a RareProvider');
  }
  return context;
};
