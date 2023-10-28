import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { getRareSettings } from './getRareSettings';
import { RareDrop, RareSettingsResponse } from './types';

export const deleteRareDrop = async (
  user: User | null,
  firestore: Firestore,
  ship: string
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map(), colors: new Map() };

  const data = await getRareSettings(user, firestore);
  const drops = data.drops;
  drops.delete(ship);

  const rareDropsArray: RareDrop[] = [];
  drops.forEach((id, ship) => {
    rareDropsArray.push({ ship, id });
  });
  await setDoc(
    doc(firestore, 'rare', user.uid),
    {
      drops: rareDropsArray,
    },
    { merge: true }
  );

  return { drops, colors: data.colors };
};
