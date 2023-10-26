import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { useApiClient } from './ApiClientContext';

interface EventsAreasContextProps {
  eventsAreas: Map<string, string[]>;
  setEventsAreas: Dispatch<SetStateAction<Map<string, string[]>>>;
  createEventsAreas: (event: string, area: string) => void;
  getEventsAreas: () => void;
  deleteEventsAreas: (event: string, area: string) => void;
}

const EventsAreasContext = createContext<EventsAreasContextProps | null>(null);

export const EventsAreasProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { apiClient } = useApiClient();

  const [eventsAreas, setEventsAreas] = useState<Map<string, string[]>>(
    new Map()
  );

  const createEventsAreas = async (event: string, area: string) => {
    await apiClient.createEventsAreas(event, area);
    const eventAreas = eventsAreas.get(event);
    if (eventAreas) {
      if (eventAreas.includes(area)) return;
      setEventsAreas((preEventsAreas) => {
        preEventsAreas.get(event)?.push(area);
        return preEventsAreas;
      });
    } else {
      setEventsAreas((preEventsAreas) => {
        preEventsAreas.set(event, [area]);
        return preEventsAreas;
      });
    }
  };
  const getEventsAreas = async () => {
    const eventsAreas = await apiClient.getEventsAreas();
    setEventsAreas(eventsAreas.results);
  };
  const deleteEventsAreas =  async(event: string, area: string) => {
    await apiClient.deleteEventsAreas(event, area);
    const eventAreas = eventsAreas.get(event);
    const updatedEventAreas =
      eventAreas?.filter((eventArea) => eventArea !== area) ?? [];
    if (updatedEventAreas.length === 0) {
      setEventsAreas((preEventsAreas) => {
        preEventsAreas.delete(event);
        return preEventsAreas;
      });
    } else {
      setEventsAreas((preEventsAreas) => {
        preEventsAreas.set(event, updatedEventAreas);
        return preEventsAreas;
      });
    }
  };

  return (
    <EventsAreasContext.Provider
      value={{
        eventsAreas,
        setEventsAreas,
        createEventsAreas,
        getEventsAreas,
        deleteEventsAreas,
      }}
    >
      {children}
    </EventsAreasContext.Provider>
  );
};

export const useEventsAreasContext = (): EventsAreasContextProps => {
  const context = useContext(EventsAreasContext);
  if (!context) {
    throw new Error(
      'useEventsAreasContext must be used within a EventsAreasProvider'
    );
  }
  return context;
};
