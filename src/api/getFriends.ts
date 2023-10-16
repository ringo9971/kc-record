import { User } from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore';

export const getFriends = async (
  user: User | null,
  firestore: Firestore
): Promise<string[]> => {
  if (!user) return [];

  const docSnap = await getDoc(doc(firestore, 'friends', user.uid));
  return docSnap.data()?.friends ?? [];
};
