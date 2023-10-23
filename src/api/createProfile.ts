import { User } from 'firebase/auth';
import { doc, setDoc, Firestore } from 'firebase/firestore';

export const createProfile = async (
  user: User | null,
  firestore: Firestore,
  name: string,
  message: string
) => {
  if (!user || !name) return null;

  await setDoc(
    doc(firestore, 'profile', user.uid),
    {
      name: name,
      message: message,
    },
    { merge: true }
  );
};
