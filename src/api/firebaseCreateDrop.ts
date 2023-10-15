
import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { getAreaDrops } from './firebaseGetDrops';
import { Drop, DropRequest, FirestoreDrop } from './types';

export const createDrop = async (
  user: User | null,
  firestore: Firestore,
  drop: DropRequest
) => {
  if (!user) return null;

  const drops = await getAreaDrops(user, firestore, drop.event, drop.area);

  const firestoreDrops: FirestoreDrop[] = drops.map((drop: Drop) => {
    return {
      id: drop.id,
      time: drop.time,
      outcome: drop.outcome,
      ship: drop.ship,
      comment: drop.comment,
    };
  });

  firestoreDrops.push({
    id: uuidv4(),
    time: new Date(),
    outcome: drop.outcome,
    ship: drop.ship,
    comment: drop.comment,
  });

  await setDoc(doc(firestore, 'drops', user.uid, drop.event, drop.area), {
    results: firestoreDrops,
  });
};
