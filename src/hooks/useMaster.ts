import { useContext } from 'react';

import { MasterContext, MasterContextProps } from '../lib/MasterContext.ts';

export const useMaster = (): MasterContextProps => {
  const context = useContext(MasterContext);
  if (!context) {
    throw new Error('useMaster must be used within a MasterProvider');
  }
  return context;
};
