import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { getRareSettings } from './getRareSettings';
import { RareSettingsResponse, RareDrop } from './types';

export const createRareDrop = async (
  user: User | null,
  firestore: Firestore,
  ship: string,
  rare: string
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map() };

  const data = await getRareSettings(user, firestore);
  const drops = data.drops;
  if (drops.has(ship)) {
    return { drops: drops };
  }

  const rareDrops = drops.set(ship, rare);

  const rareDropsArray: RareDrop[] = [];

  rareDrops.forEach((rare, ship) => {
    rareDropsArray.push({ ship, rare });
  });
  await setDoc(
    doc(firestore, 'rare', user.uid),
    {
      drops: rareDropsArray,
    },
    { merge: true }
  );

  return { drops };
};
