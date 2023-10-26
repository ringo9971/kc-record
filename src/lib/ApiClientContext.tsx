import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { createContext, useContext } from 'react';

import { ApiClient } from '../api/ApiClient';

interface ApiClientContextProps {
  apiClient: ApiClient;
}

const ApiClientContext = createContext<ApiClientContextProps | null>(null);

export const ApiClientProvider = ({
  user,
  firestore,
  children,
}: {
  user: User | null;
  firestore: Firestore;
  children: JSX.Element;
}) => {
  const apiClient = new ApiClient(user, firestore);

  return (
    <ApiClientContext.Provider value={{ apiClient }}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClient = () => {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error(
      'useApiClientContext must be used within a ApiCLientProvider'
    );
  }
  return context;
};
