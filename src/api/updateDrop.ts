import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

import { createEventsAreas } from './createEventsAreas';
import { deleteDrop } from './deleteDrop';
import { getAreaFirestoreDrops } from './getDrops';
import { Drop, FirestoreDrop } from './types';

export const updateDrop = async (
  user: User | null,
  firestore: Firestore,
  dropId: string,
  preDrop: Drop,
  updateDrop: Drop
) => {
  if (!user) return null;

  if (preDrop.event === updateDrop.event && preDrop.area === updateDrop.area) {
    const drops = await getAreaFirestoreDrops(
      user,
      firestore,
      updateDrop.event,
      updateDrop.area
    );
    const firestoreDrops: FirestoreDrop[] = drops.map((drop) => {
      return {
        ...drop,
        outcome: drop.id === dropId ? updateDrop.outcome : drop.outcome,
        ship: drop.id === dropId ? updateDrop.ship : drop.ship,
        comment: drop.id === dropId ? updateDrop.comment : drop.comment,
      };
    });

    await setDoc(
      doc(firestore, 'drops', user.uid, updateDrop.event, updateDrop.area),
      {
        results: firestoreDrops,
      },
      { merge: true }
    );
    return;
  }

  await deleteDrop(user, firestore, dropId, preDrop.event, preDrop.area);
  await _createDrop(user, firestore, updateDrop);
  await createEventsAreas(user, firestore, updateDrop.event, updateDrop.area);
};

const _createDrop = async (
  user: User | null,
  firestore: Firestore,
  drop: Drop
) => {
  if (!user) return null;

  const firestoreDrops = await getAreaFirestoreDrops(
    user,
    firestore,
    drop.event,
    drop.area
  );

  firestoreDrops.push({
    id: drop.id,
    time: drop.time,
    outcome: drop.outcome,
    ship: drop.ship,
    comment: drop.comment,
  });

  await setDoc(
    doc(firestore, 'drops', user.uid, drop.event, drop.area),
    {
      results: firestoreDrops,
    },
    { merge: true }
  );
};
