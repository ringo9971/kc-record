import { createContext } from 'react';

import { Resource, ResourceRequest } from '../api/types';

export interface ResourcesContextProps {
  resources: Resource[];
  createResource: (req: ResourceRequest) => Promise<Resource | null>;
  getResources: () => void;
}

export const ResourcesContext = createContext<ResourcesContextProps | null>(null);
