import {
  Dispatch,
  SetStateAction,
  createContext,
} from 'react';

export interface EventsAreasContextProps {
  eventsAreas: Map<string, string[]>;
  setEventsAreas: Dispatch<SetStateAction<Map<string, string[]>>>;
  createEventsAreas: (event: string, area: string) => void;
  getEventsAreas: () => void;
  deleteEventsAreas: (event: string, area: string) => void;
}

export const EventsAreasContext = createContext<EventsAreasContextProps | null>(null);
