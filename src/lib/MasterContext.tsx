import { createContext, useContext } from 'react';

import shipsData from '../assets/ships.json';

export interface ShipMaster {
  name: string;
  yomi: string;
}
interface MasterContextProps {
  shipsMaster: ShipMaster[];
}

const MasterContext = createContext<MasterContextProps | null>(null);

export const MasterProvider = ({ children }: { children: JSX.Element }) => {
  const ships: ShipMaster[] = shipsData.ships;

  return (
    <MasterContext.Provider value={{ shipsMaster: ships }}>
      {children}
    </MasterContext.Provider>
  );
};

export const useMasterContext = (): MasterContextProps => {
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error('useMasterContext must be used within a MasterProvider');
  }
  return context;
};
