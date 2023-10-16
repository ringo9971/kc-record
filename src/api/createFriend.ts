import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';

import { getFriends } from './getFriends';
import { getProfile } from './getProfile';
import { Profile } from './types';

export const createFriend = async (
  user: User | null,
  firestore: Firestore,
  friendId: string
): Promise<Profile | null> => {
  if (!user) return null;

  const profile = await getProfile(user, firestore, friendId);
  if (!profile) return null;

  const friends = await getFriends(user, firestore);
  if (friends.includes(friendId)) return null;

  friends.push(friendId);
  setDoc(doc(firestore, 'friends', user.uid), { friends: friends });

  return profile;
};
