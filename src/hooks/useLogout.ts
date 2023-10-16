import { getAuth, signOut } from 'firebase/auth';

export const useLogout = () => {
  const auth = getAuth();

  const logout = () => {
    signOut(auth);
  };

  return { logout };
};
