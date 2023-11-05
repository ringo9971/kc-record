import { createContext, useContext, useState } from 'react';

import { useApiClient } from './ApiClientContext';
import { Resource, ResourceRequest } from '../api/types';

interface ResourcesContextProps {
  resources: Resource[];
  createResource: (req: ResourceRequest) => Promise<Resource | null>;
  getResources: () => void;
}

const ResourcesContext = createContext<ResourcesContextProps | null>(null);

export const ResourcesProvider = ({ children }: { children: JSX.Element }) => {
  const { apiClient } = useApiClient();

  const [resources, setResources] = useState<Resource[]>([]);

  const createResource = async (
    req: ResourceRequest
  ): Promise<Resource | null> => {
    const newResource = await apiClient.createResource(req);
    if (!newResource) return null;
    setResources((preResources) => [newResource, ...preResources]);
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

export const useResourcesContext = (): ResourcesContextProps => {
  const context = useContext(ResourcesContext);
  if (!context) {
    throw new Error(
      'useResourcesContext must be used within a ResourcesProvider'
    );
  }
  return context;
};
