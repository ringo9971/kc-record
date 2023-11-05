import { User } from 'firebase/auth';
import { Firestore, doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

import { getResources } from './getResources';
import { Resource, ResourceRequest } from './types';

export const createResource = async (
  user: User | null,
  firestore: Firestore,
  request: ResourceRequest
): Promise<Resource | null> => {
  if (!user) return null;

  const firestoreResources = await getResources(user, firestore);

  const firestoreResource = {
    id: uuidv4(),
    time: new Date(),
    fuel: request.fuel,
    ammo: request.ammo,
    steel: request.steel,
    bauxite: request.bauxite,
    bucket: request.bucket,
    nail: request.nail,
    screw: request.screw,
  };
  firestoreResources.push(firestoreResource);

  await setDoc(
    doc(firestore, 'resource', user.uid),
    {
      results: firestoreResources,
    },
    { merge: true }
  );

  return firestoreResource;
};
