import { getEventsAreas } from './getEventsAreas';

export const createEventsAreas = async (event: string, area: string) => {
  if (!event || !area) return;

  const eventsAreas = await getEventsAreas();

  if (eventsAreas && eventsAreas.results.size > 0) {
    const newEventsAreas = eventsAreas.results;
    const eventAreas =
      new Set<string>(newEventsAreas.get(event)) ?? new Set<string>();
    eventAreas.add(area);
    newEventsAreas.set(event, Array.from(eventAreas));
    localStorage.setItem(
      'eventsAreas',
      JSON.stringify(Object.fromEntries(newEventsAreas))
    );
  } else {
    const newEventsAreas = new Map<string, string[]>();
    newEventsAreas.set(event, [area]);
    localStorage.setItem(
      'eventsAreas',
      JSON.stringify(Object.fromEntries(newEventsAreas))
    );
  }
};
