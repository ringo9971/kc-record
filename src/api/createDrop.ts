import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { createEventsAreas } from './createEventsAreas';
import { getAreaFirestoreDrops } from './getDrops';
import { DropRequest } from './types';

export const createDrop = async (
  user: User | null,
  firestore: Firestore,
  drop: DropRequest
) => {
  if (!user) return null;

  const firestoreDrops = await getAreaFirestoreDrops(
    user,
    firestore,
    drop.event,
    drop.area
  );

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
  await createEventsAreas(user, firestore, drop.event, drop.area);
};
