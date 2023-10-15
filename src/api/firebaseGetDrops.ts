import { User } from 'firebase/auth';
import { doc, Firestore, getDoc } from 'firebase/firestore';

import { getEventsAreas } from './firebaseGetEventsAreas';
import { Drop, FirestoreDrop } from './types';

const sortDropsByTime = <T extends { time: Date }>(drops: T[]): T[] => {
  return drops.sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
};

const mapFirestoreDropsToDrops = (
  firestoreDrops: FirestoreDrop[],
  event: string,
  area: string
): Drop[] => {
  return firestoreDrops.map((drop) => ({
    ...drop,
    event,
    area,
  }));
};

export const getDrops = async (
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

  return sortDropsByTime(results);
};

export const getAreaDrops = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string
): Promise<Drop[]> => {
  if (!user) return [];

  const firestoreDrops = await getAreaFirestoreDrops(
    user,
    firestore,
    event,
    area
  );
  const drops = mapFirestoreDropsToDrops(firestoreDrops, event, area);

  return sortDropsByTime(drops);
};

export const getFirestoreDrops = async (
  user: User | null,
  firestore: Firestore
): Promise<FirestoreDrop[]> => {
  if (!user) return [];

  const eventsAreas = await getEventsAreas(user, firestore);
  const results: FirestoreDrop[] = [];

  for (const [event, areas] of eventsAreas.results.entries()) {
    for (const area of areas) {
      const areaResults = await getAreaDrops(user, firestore, event, area);
      results.push(...areaResults);
    }
  }

  return sortDropsByTime(results);
};

export const getAreaFirestoreDrops = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string
): Promise<FirestoreDrop[]> => {
  if (!user) return [];

  const docSnap = await getDoc(doc(firestore, 'drops', user.uid, event, area));
  const results: FirestoreDrop[] = docSnap.data()?.results ?? [];

  return sortDropsByTime(results);
};
