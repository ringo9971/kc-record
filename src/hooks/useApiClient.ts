import { useContext } from 'react';

import { ApiClientContext } from '../lib/ApiClientContext';

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within a ApiClientProvider');
  }
  return context;
};
