import { useContext } from 'react';

import { EventsAreasContext, EventsAreasContextProps } from '../lib/EventsAreasContext.ts';

export const useEventsAreas = (): EventsAreasContextProps => {
  const context = useContext(EventsAreasContext);
  if (!context) {
    throw new Error(
      'useEventsAreas must be used within a EventsAreasProvider'
    );
  }
  return context;
};
