import { User } from 'firebase/auth';
import { Firestore, doc, getDoc } from 'firebase/firestore';

import { FirestoreResource, Resource } from './types';

export const getResources = async (
  user: User | null,
  firestore: Firestore
): Promise<Resource[]> => {
  if (!user) return [];

  const docSnap = await getDoc(doc(firestore, 'resource', user.uid));
  const results: Resource[] = (docSnap.data()?.results ?? []).map(
    (result: FirestoreResource) => ({
      ...result,
      time: new Date(
        result.time.seconds * 1000 + result.time.nanoseconds / 1e6
      ),
    })
  );

  return results;
};
