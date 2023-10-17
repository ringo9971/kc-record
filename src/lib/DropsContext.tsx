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
}

const DropsContext = createContext<DropsContextProps | null>(null);

export const DropsProvider = ({ children }: { children: JSX.Element }) => {
  const [drops, setDrops] = useState<Drop[]>([]);

  return (
    <DropsContext.Provider value={{ drops, setDrops }}>
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
