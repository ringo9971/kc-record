import { useEffect, useState } from 'react';

import { User, getAuth, onAuthStateChanged } from 'firebase/auth';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  return { user, loading };
};
