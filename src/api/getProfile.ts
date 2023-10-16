import { User } from 'firebase/auth';
import { doc, getDoc, Firestore } from 'firebase/firestore';

import { Profile } from './types';

export const getProfiles = async (
  user: User | null,
  firestore: Firestore,
  friendIds: string[]
): Promise<Profile[]> => {
  if (!user) return [];

  const results: Profile[] = [];
  for (const friendId of friendIds) {
    const profile = await getProfile(user, firestore, friendId);
    if (!profile) continue;
    results.push(profile);
  }

  return results;
};

export const getProfile = async (
  user: User | null,
  firestore: Firestore,
  friendId: string
): Promise<Profile | null> => {
  if (!user) return null;

  const docSnap = await getDoc(doc(firestore, 'profile', friendId));
  if (!docSnap.exists()) return null;

  const data = docSnap.data();
  return {
    name: data.name,
    message: data.message,
  };
};
