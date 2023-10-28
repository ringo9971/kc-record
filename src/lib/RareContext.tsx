import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { useApiClient } from './ApiClientContext';
import { RareColor, RareColorRequest } from '../api/types';

interface RareContextProps {
  rareDrops: Map<string, string>;
  setRareDrops: Dispatch<SetStateAction<Map<string, string>>>;
  getRareDrops: () => void;
  createRareDrop: (ship: string, id: string) => void;
  colorsDrops: Map<string, string[]>;
  rareColors: Map<string, RareColor>;
  createRareColor: (req: RareColorRequest) => void;
  getColor: (id?: string) => RareColor;
  getColorByShip: (ship?: string) => RareColor;
  deleteRareDrop: (ship: string) => void;
}

const RareContext = createContext<RareContextProps | null>(null);

export const RareProvider = ({ children }: { children: JSX.Element }) => {
  const { apiClient } = useApiClient();

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

  const createRareColor = async (req: RareColorRequest) => {
    const setting = await apiClient.createRareColor(req);
    setRareColors(setting.colors);
  };

  const createRareDrop = async (ship: string, id: string) => {
    if (!ship) return;
    const setting = await apiClient.createRareDrop(ship, id);
    setRareDrops(setting.drops);
    setColorsDrops(() => groupShipsByColor(setting.drops));
  };
  const getRareDrops = async () => {
    const setting = await apiClient.getRareSettings();
    setRareDrops(setting.drops);
    setColorsDrops(() => groupShipsByColor(setting.drops));
    setRareColors(setting.colors);
  };
  const deleteRareDrop = async (ship: string) => {
    const setting = await apiClient.deleteRareDrop(ship);
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
        getRareDrops,
        createRareDrop,
        colorsDrops,
        rareColors,
        createRareColor,
        getColor,
        getColorByShip,
        deleteRareDrop,
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
