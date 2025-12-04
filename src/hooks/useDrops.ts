import { useContext } from 'react';

import { DropsContext, DropsContextProps } from '../lib/DropsContext.ts';

export const useDrops = (): DropsContextProps => {
  const context = useContext(DropsContext);
  if (!context) {
    throw new Error('useDrops must be used within a DropsProvider');
  }
  return context;
};
