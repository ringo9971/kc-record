import { createContext, useContext } from 'react';

import shipsData from '../assets/ships.json';

export interface ShipMaster {
  name: string;
  yomi: string;
  type: string;
  country: string;
}
interface MasterContextProps {
  shipsMaster: ShipMaster[];
  shipCountryMaster: Map<string, string>;
  shipTypeMaster: Map<string, string>;
}

const MasterContext = createContext<MasterContextProps | null>(null);

export const MasterProvider = ({ children }: { children: JSX.Element }) => {
  const ships: ShipMaster[] = shipsData.ships;

  const country = new Map<string, string>();
  ships.forEach((ship) => {
    country.set(ship.name, ship.country);
  });
  const types = new Map<string, string>();
  ships.forEach((ship) => {
    types.set(ship.name, ship.type);
  });

  return (
    <MasterContext.Provider
      value={{
        shipsMaster: ships,
        shipCountryMaster: country,
        shipTypeMaster: types,
      }}
    >
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
