import { useState } from 'react';

import { ResourcesContext } from './ResourceContext';
import { Resource, ResourceRequest } from '../api/types';
import { useApiClient } from '../hooks/useApiClient';


export const ResourcesProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiClient } = useApiClient();

  const [resources, setResources] = useState<Resource[]>([]);

  const createResource = async (
    req: ResourceRequest
  ): Promise<Resource | null> => {
    const newResource = await apiClient.createResource(req);
    if (!newResource) return null;
    setResources((preResources) => [...preResources, newResource]);
    return newResource;
  };
  const getResources = async () => {
    const resources = await apiClient.getResources();
    setResources(resources);
  };

  return (
    <ResourcesContext.Provider
      value={{
        resources,
        createResource,
        getResources,
      }}
    >
      {children}
    </ResourcesContext.Provider>
  );
};
