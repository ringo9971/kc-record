import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { Drop } from '../api/types';

interface DropsContextProps {
  drops: Drop[];
  setDrops: Dispatch<SetStateAction<Drop[]>>;
  dropsProviderCreateDrop: (drop: Drop) => void;
  dropsProviderUpdateDrop: (
    dropId: string,
    preDrop: Drop,
    newDrop: Drop
  ) => void;
}

const DropsContext = createContext<DropsContextProps | null>(null);

export const DropsProvider = ({ children }: { children: JSX.Element }) => {
  const [drops, setDrops] = useState<Drop[]>([]);

  const dropsProviderCreateDrop = (drop: Drop) => {
    setDrops((preDrops) => [drop, ...preDrops]);
  };
  const dropsProviderUpdateDrop = (
    dropId: string,
    _preDrop: Drop,
    newDrop: Drop
  ) => {
    setDrops(() =>
      drops.map((drop: Drop) => {
        if (drop.id === dropId) return newDrop;
        return drop;
      })
    );
  };

  return (
    <DropsContext.Provider
      value={{
        drops,
        setDrops,
        dropsProviderCreateDrop,
        dropsProviderUpdateDrop,
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
