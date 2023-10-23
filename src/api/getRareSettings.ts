import { User } from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore';

import { RareDrop, RareSettingsResponse } from './types';

export const getRareSettings = async (
  user: User | null,
  firestore: Firestore
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map() };

  const docSnap = await getDoc(doc(firestore, 'rare', user.uid));

  const drops: RareDrop[] = docSnap.data()?.drops ?? [];

  const results: Map<string, string> = new Map();

  drops.forEach((drop) => {
    results.set(drop.ship, drop.rare);
  });

  return { drops: results };
};
