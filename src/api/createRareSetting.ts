import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { getRareSettings } from './getRareSettings';
import {
  RareSettingsResponse,
  RareDrop,
  RareColorRequest,
  FirestoreRareColor,
} from './types';

export const createRareColor = async (
  user: User | null,
  firestore: Firestore,
  req: RareColorRequest
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map(), colors: new Map() };

  const data = await getRareSettings(user, firestore);
  const colors = data.colors;
  colors.set(uuidv4(), {
    color: req.color,
    bgColor: req.bgColor,
    comment: req.comment,
  });

  const rareColorsArray: FirestoreRareColor[] = [];

  colors.forEach((rareColor, id) => {
    rareColorsArray.push({
      id,
      color: rareColor.color,
      bgColor: rareColor.bgColor,
      comment: rareColor.comment,
    });
  });
  await setDoc(
    doc(firestore, 'rare', user.uid),
    {
      colors: rareColorsArray,
    },
    { merge: true }
  );

  return { drops: data.drops, colors };
};

export const createRareDrop = async (
  user: User | null,
  firestore: Firestore,
  ship: string,
  id: string
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map(), colors: new Map() };

  const data = await getRareSettings(user, firestore);
  const drops = data.drops;
  if (drops.has(ship)) {
    return { drops, colors: data.colors };
  }

  const rareDrops = drops.set(ship, id);

  const rareDropsArray: RareDrop[] = [];

  rareDrops.forEach((id, ship) => {
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
