import { useState } from 'react';

import { RareColor, RareColorRequest } from '../api/types';
import { useApiClient } from '../hooks/useApiClient';
import { RareContext } from './RareContext';

export const RareProvider = ({ children }: { children: React.ReactNode }) => {
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
  const updateRareColor = async (id: string, req: RareColorRequest) => {
    const setting = await apiClient.updateRareColor(id, req);
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
    return id ? (rareColors.get(id) ?? getDefaultColor()) : getDefaultColor();
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
        updateRareColor,
        deleteRareDrop,
      }}
    >
      {children}
    </RareContext.Provider>
  );
};
