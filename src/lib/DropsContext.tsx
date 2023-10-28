import { createContext, useContext, useState } from 'react';

import { useApiClient } from './ApiClientContext';
import { useEventsAreasContext } from './EventsAreasContext';
import { Drop, DropRequest } from '../api/types';

interface DropsContextProps {
  drops: Drop[];
  createDrop: (drop: DropRequest) => Promise<Drop | null>;
  getDrops: () => void;
  updateDrop: (dropId: string, preDrop: Drop, newDrop: Drop) => void;
  deleteDrop: (dropId: string) => void;
}

const DropsContext = createContext<DropsContextProps | null>(null);

export const DropsProvider = ({ children }: { children: JSX.Element }) => {
  const { apiClient } = useApiClient();

  const [drops, setDrops] = useState<Drop[]>([]);
  const { createEventsAreas, deleteEventsAreas } = useEventsAreasContext();

  const createDrop = async (drop: DropRequest): Promise<Drop | null> => {
    const newDrop = await apiClient.createDrop(drop);
    if (!newDrop) return null;
    setDrops((preDrops) => [newDrop, ...preDrops]);
    createEventsAreas(drop.event, drop.area);
    return newDrop;
  };
  const getDrops = async () => {
    const drops = await apiClient.getDrops();
    setDrops(drops);
  };
  const updateDrop = async (dropId: string, preDrop: Drop, newDrop: Drop) => {
    await apiClient.updateDrop(dropId, preDrop, newDrop);
    const matchingDrops = drops.filter(
      (drop) => drop.event === preDrop.event && drop.area === preDrop.area
    );
    if (matchingDrops.length === 1) {
      deleteEventsAreas(preDrop.event, preDrop.area);
    }
    setDrops((preDrops) =>
      preDrops.map((drop: Drop) => {
        if (drop.id === dropId) return newDrop;
        return drop;
      })
    );
    createEventsAreas(newDrop.event, newDrop.area);
  };
  const deleteDrop = async (dropId: string) => {
    const drop = drops.find((drop) => drop.id === dropId);
    if (!drop) return;

    const eventsAreaDrops = drops.filter(
      (d) => d.event === drop.event && d.area === drop.area
    );
    if (eventsAreaDrops.length === 1) {
      deleteEventsAreas(drop.event, drop.area);
    }
    setDrops((preDrops) => preDrops.filter((drop) => drop.id !== dropId));
    await apiClient.deleteDrop(dropId, drop.event, drop.area);
  };

  return (
    <DropsContext.Provider
      value={{
        drops,
        createDrop,
        getDrops,
        updateDrop,
        deleteDrop,
      }}
    >
      {children}
    </DropsContext.Provider>
  );
};

export const useDropsContext = (): DropsContextProps => {
  const context = useContext(DropsContext);
  if (!context) {
    throw new Error('useDropsContext must be used within a DropsProvider');
  }
  return context;
};
