import { useContext } from 'react';

import { RareContext, RareContextProps } from '../lib/RareContext.ts';

export const useRare = (): RareContextProps => {
  const context = useContext(RareContext);
  if (!context) {
    throw new Error('useRare must be used within a RareProvider');
  }
  return context;
};
