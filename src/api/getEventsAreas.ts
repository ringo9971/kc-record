import { User } from 'firebase/auth';
import { doc, Firestore, getDoc } from 'firebase/firestore';

import { EventAreas, EventsAreasResponse } from './types';

export const getEventsAreas = async (
  user: User | null,
  firestore: Firestore
): Promise<EventsAreasResponse> => {
  if (!user) return { results: new Map() };

  const docSnap = await getDoc(doc(firestore, 'drops', user.uid));

  if (!docSnap.exists()) {
    return { results: new Map() };
  }

  const data = docSnap.data();
  if (!data.eventsAreas) return { results: new Map() };

  const eventsAreas: EventAreas[] = data.eventsAreas;
  const results: Map<string, string[]> = new Map();

  eventsAreas.forEach((eventAreas) => {
    results.set(eventAreas.event, eventAreas.areas);
  });

  return { results: results };
};
