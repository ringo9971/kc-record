import { createContext } from 'react';

export interface ShipMaster {
  name: string;
  yomi: string;
  type: string;
  country: string;
}

export interface MasterContextProps {
  shipsMaster: ShipMaster[];
  shipCountryMaster: Map<string, string>;
  shipTypeMaster: Map<string, string>;
}

export const MasterContext = createContext<MasterContextProps | null>(null);
