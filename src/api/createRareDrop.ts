import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { getRareDrops } from './getRareDrops';
import { RareDropsResponse, RareDrop } from './types';

export const createRareDrop = async (
  user: User | null,
  firestore: Firestore,
  ship: string,
  rare: string
): Promise<RareDropsResponse> => {
  if (!user) return { results: new Map() };

  const data = await getRareDrops(user, firestore);
  const drops = data.results;
  if (drops.has(ship)) {
    return { results: drops };
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

  return { results: drops };
};
