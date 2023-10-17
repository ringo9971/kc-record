import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface EventsAreasContextProps {
  eventsAreas: Map<string, string[]>;
  setEventsAreas: Dispatch<SetStateAction<Map<string, string[]>>>;
  createEventsAreas: (event: string, area: string) => void;
  deleteEventsAreas: (event: string, area: string) => void;
}

const EventsAreasContext = createContext<EventsAreasContextProps | null>(null);

export const EventsAreasProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [eventsAreas, setEventsAreas] = useState<Map<string, string[]>>(
    new Map()
  );

  const createEventsAreas = (event: string, area: string) => {
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

  const deleteEventsAreas = (event: string, area: string) => {
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
