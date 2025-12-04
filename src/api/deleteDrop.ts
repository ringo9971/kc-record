import { deleteEventsAreas } from './deleteEventsAreas';
import { getAreaFirestoreDrops } from './getDrops';
import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

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

  await setDoc(
    doc(firestore, 'drops', user.uid, event, area),
    {
      results: updatedDrops,
    },
    { merge: true }
  );

  if (updatedDrops.length === 0)
    await deleteEventsAreas(user, firestore, event, area);
};
