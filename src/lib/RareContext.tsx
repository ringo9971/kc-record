import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { createRareColor, createRareDrop } from '../api/createRareSetting';
import { getRareSettings } from '../api/getRareSettings';
import { RareColor, RareColorRequest } from '../api/types';

interface RareContextProps {
  rareDrops: Map<string, string>;
  setRareDrops: Dispatch<SetStateAction<Map<string, string>>>;
  fetchRareDrops: (user: User | null, firestore: Firestore) => void;
  addRareDrop: (
    user: User | null,
    firestore: Firestore,
    ship: string,
    id: string
  ) => void;
  colorsDrops: Map<string, string[]>;
  rareColors: Map<string, RareColor>;
  addRareColor: (
    user: User | null,
    firestore: Firestore,
    req: RareColorRequest
  ) => void;
  getColor: (id?: string) => RareColor;
  getColorByShip: (ship?: string) => RareColor;
}

const RareContext = createContext<RareContextProps | null>(null);

export const RareProvider = ({ children }: { children: JSX.Element }) => {
  const [rareDrops, setRareDrops] = useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [colorsDrops, setColorsDrops] = useState<Map<string, string[]>>(
    new Map<string, string[]>()
  );
  const [rareColors, setRareColors] = useState<Map<string, RareColor>>(
    new Map<string, RareColor>()
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

    const setting = await getRareSettings(user, firestore);
    setRareDrops(setting.drops);
    setColorsDrops(() => groupShipsByColor(setting.drops));
    setRareColors(setting.colors);
  };

  const addRareColor = async (
    user: User | null,
    firestore: Firestore,
    req: RareColorRequest
  ) => {
    if (!user) return;
    const setting = await createRareColor(user, firestore, req);
    setRareColors(setting.colors);
  };

  const addRareDrop = async (
    user: User | null,
    firestore: Firestore,
    ship: string,
    id: string
  ) => {
    if (!user || !ship) return;
    const setting = await createRareDrop(user, firestore, ship, id);
    setRareDrops(setting.drops);
    setColorsDrops(() => groupShipsByColor(setting.drops));
  };

  const getDefaultColor = (): RareColor => ({
    color: '#000000',
    bgColor: '#FFFFFF',
    comment: '',
  });

  const getColor = (id?: string): RareColor => {
    return id ? rareColors.get(id) ?? getDefaultColor() : getDefaultColor();
  };

  const getColorByShip = (ship?: string): RareColor => {
    const id = ship && rareDrops.get(ship);
    return getColor(id);
  };

  return (
    <RareContext.Provider
      value={{
        rareDrops,
        setRareDrops,
        fetchRareDrops,
        addRareDrop,
        colorsDrops,
        rareColors,
        addRareColor,
        getColor,
        getColorByShip,
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
