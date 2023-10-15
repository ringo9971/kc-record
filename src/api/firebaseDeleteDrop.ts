import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

import { getAreaFirestoreDrops } from './firebaseGetDrops';

export const deleteDrop = async (
  user: User | null,
  firestore: Firestore,
  dropId: string,
  event: string,
  area: string
) => {
  if (!user) return null;

  const drops = await getAreaFirestoreDrops(user, firestore, event, area);
  const updatedDrops = drops.filter((drop) => drop.id !== dropId);

  await setDoc(doc(firestore, 'drops', user.uid, event, area), {
    results: updatedDrops,
  });
};
