import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

import { getEventsAreas } from './getEventsAreas';
import { EventAreas } from './types';

export const createEventsAreas = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string
) => {
  if (!user || !event || !area) return null;

  const eventsAreasResponse = await getEventsAreas(user, firestore);

  const eventsAreas = eventsAreasResponse.results;
  const eventAreas = eventsAreas.get(event);

  if (eventAreas) {
    if (eventAreas.includes(area)) return;
    eventsAreas.get(event)?.push(area);
  } else {
    eventsAreas.set(event, [area]);
  }

  const eventAreasArray: EventAreas[] = [];

  eventsAreas.forEach((areas, event) => {
    eventAreasArray.push({ event, areas });
  });

  await setDoc(
    doc(firestore, 'drops', user.uid),
    {
      eventsAreas: eventAreasArray,
    },
    { merge: true }
  );
};
