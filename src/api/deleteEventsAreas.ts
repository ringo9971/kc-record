import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

import { getEventsAreas } from './getEventsAreas';
import { EventAreas } from './types';

export const deleteEventsAreas = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string
) => {
  if (!user) return null;

  const eventsAreasResponse = await getEventsAreas(user, firestore);

  const eventsAreas = eventsAreasResponse.results;
  const eventAreas = eventsAreas.get(event);

  const updatedEventAreas =
    eventAreas?.filter((eventArea) => eventArea !== area) ?? [];
  if (updatedEventAreas.length === 0) {
    eventsAreas.delete(event);
  } else {
    eventsAreas.set(event, updatedEventAreas);
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
