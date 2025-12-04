import { EventAreas, EventsAreasResponse } from './types';
import { User } from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore';

export const getEventsAreas = async (
  user: User | null,
  firestore: Firestore,
  userId?: string
): Promise<EventsAreasResponse> => {
  if (!user) return { results: new Map() };

  const docSnap = await getDoc(doc(firestore, 'drops', userId ?? user.uid));

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
