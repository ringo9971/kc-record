import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { Drop, Profile } from '../api/types';

interface FriendsContextProps {
  friendsId: string[];
  setFriendsId: Dispatch<SetStateAction<string[]>>;
  friendsProfile: Profile[];
  setFriendsProfile: Dispatch<SetStateAction<Profile[]>>;
  friendsDrops: Drop[][];
  setFriendsDrops: Dispatch<SetStateAction<Drop[][]>>;
}

const FriendsContext = createContext<FriendsContextProps | null>(null);

export const FriendsProvider = ({ children }: { children: JSX.Element }) => {
  const [friendsId, setFriendsId] = useState<string[]>([]);
  const [friendsProfile, setFriendsProfile] = useState<Profile[]>([]);
  const [friendsDrops, setFriendsDrops] = useState<Drop[][]>([]);

  return (
    <FriendsContext.Provider
      value={{
        friendsId,
        setFriendsId,
        friendsProfile,
        setFriendsProfile,
        friendsDrops,
        setFriendsDrops,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriendsContext = (): FriendsContextProps => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriendsContext must be used within a FriendsProvider');
  }
  return context;
};
