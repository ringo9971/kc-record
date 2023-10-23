import { User } from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore';

import {
  FirestoreRareColor,
  RareColor,
  RareDrop,
  RareSettingsResponse,
} from './types';

export const getRareSettings = async (
  user: User | null,
  firestore: Firestore
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map(), colors: new Map() };

  const docSnap = await getDoc(doc(firestore, 'rare', user.uid));

  const firestoreDrops: RareDrop[] = docSnap.data()?.drops ?? [];
  const firestoreColors: FirestoreRareColor[] = docSnap.data()?.colors ?? [];

  const drops: Map<string, string> = new Map();
  firestoreDrops.forEach((drop) => {
    drops.set(drop.ship, drop.id);
  });

  const colors: Map<string, RareColor> = new Map();
  firestoreColors.forEach((rareColor) => {
    colors.set(rareColor.id, rareColor);
  });

  return { drops, colors };
};
