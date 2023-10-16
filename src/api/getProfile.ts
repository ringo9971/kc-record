import { User } from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore';

import { Profile } from './types';

export const getProfile = async (
  user: User | null,
  firestore: Firestore
): Promise<Profile | null> => {
  if (!user) return null;

  const docSnap = await getDoc(doc(firestore, 'profile', user.uid));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    name: data.name,
    message: data.message,
  };
};
