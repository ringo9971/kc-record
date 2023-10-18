import { User } from 'firebase/auth';
import { doc, Firestore, getDoc, Timestamp } from 'firebase/firestore';

import { getEventsAreas } from './getEventsAreas';
import { Drop, FirestoreDrop } from './types';

interface FirestoreDropData {
  id: string;
  time: Timestamp;
  outcome: string;
  ship: string;
  comment: string;
}

const sortDropsByTime = <T extends { time: Date }>(drops: T[]): T[] => {
  return drops.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
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
  firestore: Firestore,
  userId?: string
): Promise<Drop[]> => {
  if (!user) return [];

  const eventsAreas = await getEventsAreas(user, firestore, userId);
  const results: Drop[] = [];

  for (const [event, areas] of eventsAreas.results.entries()) {
    for (const area of areas) {
      const areaResults = await getAreaDrops(
        user,
        firestore,
        event,
        area,
        userId
      );
      results.push(...areaResults);
    }
  }

  return sortDropsByTime(results);
};

export const getAreaDrops = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string,
  userId?: string
): Promise<Drop[]> => {
  if (!user) return [];

  const firestoreDrops = await getAreaFirestoreDrops(
    user,
    firestore,
    event,
    area,
    userId
  );
  const drops = mapFirestoreDropsToDrops(firestoreDrops, event, area);

  return sortDropsByTime(drops);
};

export const getFirestoreDrops = async (
  user: User | null,
  firestore: Firestore,
  userId?: string
): Promise<FirestoreDrop[]> => {
  if (!user) return [];

  const eventsAreas = await getEventsAreas(user, firestore, userId);
  const results: FirestoreDrop[] = [];

  for (const [event, areas] of eventsAreas.results.entries()) {
    for (const area of areas) {
      const areaResults = await getAreaDrops(
        user,
        firestore,
        event,
        area,
        userId
      );
      results.push(...areaResults);
    }
  }

  return sortDropsByTime(results);
};

export const getAreaFirestoreDrops = async (
  user: User | null,
  firestore: Firestore,
  event: string,
  area: string,
  userId?: string
): Promise<FirestoreDrop[]> => {
  if (!user) return [];

  const docSnap = await getDoc(
    doc(firestore, 'drops', userId ?? user.uid, event, area)
  );
  const results: FirestoreDrop[] = (docSnap.data()?.results ?? []).map(
    (result: FirestoreDropData) => ({
      ...result,
      time: new Date(
        result.time.seconds * 1000 + result.time.nanoseconds / 1e6
      ),
    })
  );

  return sortDropsByTime(results);
};
