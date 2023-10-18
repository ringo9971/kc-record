import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { createFriend } from '../api/createFriend';
import { getDrops } from '../api/getDrops';
import { getFriends } from '../api/getFriends';
import { getProfile } from '../api/getProfile';
import { Drop, Profile } from '../api/types';

interface FriendData {
  friendId: string;
  profile: Profile;
  drops: Drop[];
}

interface FriendsContextProps {
  friendsData: FriendData[];
  setFriendsData: Dispatch<SetStateAction<FriendData[]>>;
  fetchFriends: (user: User, firestore: Firestore) => void;
  addFriend: (user: User, firestore: Firestore, friendId: string) => void;
}

const FriendsContext = createContext<FriendsContextProps | null>(null);

export const FriendsProvider = ({ children }: { children: JSX.Element }) => {
  const [friendsData, setFriendsData] = useState<FriendData[]>([]);

  const fetchFriends = async (user: User, firestore: Firestore) => {
    const friendIds = await getFriends(user, firestore);

    const newFriendsData: FriendData[] = [];
    for (const friendId of friendIds) {
      const drops = await getDrops(user, firestore, friendId);
      const profile = await getProfile(user, firestore, friendId);
      if (!profile) continue;
      newFriendsData.push({ friendId, profile, drops });
    }
    setFriendsData(newFriendsData);
  };

  const addFriend = async (
    user: User,
    firestore: Firestore,
    friendId: string
  ) => {
    const profile = await createFriend(user, firestore, friendId);
    if (!profile) return;

    const drops = await getDrops(user, firestore, friendId);
    setFriendsData((preFriendsData) => [
      { friendId, profile, drops },
      ...preFriendsData,
    ]);
  };

  return (
    <FriendsContext.Provider
      value={{
        friendsData,
        setFriendsData,
        fetchFriends,
        addFriend,
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
