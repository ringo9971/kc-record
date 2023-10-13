import { EventsAreasResponse } from './types';

export const getEventsAreas = async (): Promise<EventsAreasResponse | null> => {
  const storedEventsAreas = localStorage.getItem('eventsAreas');

  if (storedEventsAreas) {
    const eventsAreas: Record<string, string[]> = JSON.parse(storedEventsAreas);

    const eventsAreasResponse = new Map<string, string[]>();
    for (const [a, b] of Object.entries(eventsAreas)) {
      eventsAreasResponse.set(a, b);
    }

    return { results: eventsAreasResponse };
  }
  return null;
};
