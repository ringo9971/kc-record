import { getDrops } from './getDrops';
import { getEventsAreas } from './getEventsAreas';
import { Drop } from './types';

export const deleteEventsAreas = async (event: string, area: string) => {
  if (!event || !area) return;

  const drops = await getDrops();
  const hasEventArea = drops?.results.filter(
    (drop: Drop) => drop.event === event && drop.area === area
  );
  if (!hasEventArea || hasEventArea.length !== 1) return;

  const eventsAreas = await getEventsAreas();
  const newEventsAreas = eventsAreas?.results;
  if (!newEventsAreas) return;

  const eventAreas = newEventsAreas.get(event);
  if (!eventAreas) return;

  const newEventAreas = eventAreas.filter((eventArea) => eventArea !== area);
  if (newEventAreas.length === 0) {
    newEventsAreas.delete(event);
  } else {
    newEventsAreas.set(event, newEventAreas);
  }
  localStorage.setItem(
    'eventsAreas',
    JSON.stringify(Object.fromEntries(newEventsAreas))
  );
};
