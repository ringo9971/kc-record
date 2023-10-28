import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { getRareSettings } from './getRareSettings';
import {
  FirestoreRareColor,
  RareColorRequest,
  RareSettingsResponse,
} from './types';

export const updateRareColor = async (
  user: User | null,
  firestore: Firestore,
  id: string,
  req: RareColorRequest
): Promise<RareSettingsResponse> => {
  if (!user) return { drops: new Map(), colors: new Map() };

  const data = await getRareSettings(user, firestore);
  const colors = data.colors;
  colors.set(id, {
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
