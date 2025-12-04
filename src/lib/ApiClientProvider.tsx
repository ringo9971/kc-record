import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

import { ApiClientContext } from './ApiClientContext.ts';
import { ApiClient } from '../api/ApiClient.ts';

export const ApiClientProvider = ({
                                    user,
                                    firestore,
                                    children,
                                  }: {
  user: User | null;
  firestore: Firestore;
  children: React.ReactNode;
}) => {
  const apiClient = new ApiClient(user, firestore);

  return (
    <ApiClientContext.Provider value={{ apiClient }}>
      {children}
    </ApiClientContext.Provider>
  );
};

