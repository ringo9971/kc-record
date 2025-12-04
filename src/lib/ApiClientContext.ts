import { createContext } from 'react';

import { ApiClient } from '../api/ApiClient';

interface ApiClientContextProps {
  apiClient: ApiClient;
}

export const ApiClientContext = createContext<ApiClientContextProps | null>(null);

