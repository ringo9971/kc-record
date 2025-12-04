import { useContext } from 'react';

import {
  ResourcesContext,
  ResourcesContextProps,
} from '../lib/ResourceContext.ts';

export const useResources = (): ResourcesContextProps => {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error('useResources must be used within a ResourcesProvider');
  }
  return context;
};
