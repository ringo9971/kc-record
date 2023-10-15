import { User } from 'firebase/auth';
import { doc, Firestore, getDoc } from 'firebase/firestore';

import { getEventsAreas } from './firebaseGetEventsAreas';
import { Drop, FirestoreDrop } from './types';

export const testDrops = async (
  user: User | null,
  firestore: Firestore
): Promise<Drop[]> => {
  if (!user) return [];

  const eventsAreas = await getEventsAreas(user, firestore);

  const results: Drop[] = [];

  for (const [event, areas] of eventsAreas.results.entries()) {
    for (const area of areas) {
      const areaResults = await getAreaDrops(user, firestore, event, area);
      results.push(...areaResults);
    }
  }

  results.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return results;
};

export const getAreaDrops = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string
): Promise<Drop[]> => {
  if (!user) return [];

  const docSnap = await getDoc(doc(firestore, 'drops', user.uid, event, area));

  if (!docSnap.exists()) {
    return [];
  }

  const data = docSnap.data();
  if (!data.results) return [];

  const drops: FirestoreDrop[] = data.results;
  const results: Drop[] = [];

  drops.forEach((drop) => {
    results.push({
      ...drop,
      event: event,
      area: area,
    });
  });

  results.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return results;
};
