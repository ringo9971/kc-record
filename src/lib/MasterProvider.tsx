import shipsData from '../assets/ships.json';
import { MasterContext } from './MasterContext';
import { ShipMaster } from './MasterContext.ts';

export const MasterProvider = ({ children }: { children: React.ReactNode }) => {
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
