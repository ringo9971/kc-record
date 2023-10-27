import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

import { useApiClient } from './ApiClientContext';
import { Drop, Profile } from '../api/types';

interface FriendData {
  friendId: string;
  profile: Profile;
  drops: Drop[];
}

interface FriendsContextProps {
  friendsData: FriendData[];
  setFriendsData: Dispatch<SetStateAction<FriendData[]>>;
  getFriends: () => void;
  createFriend: (friendId: string) => void;
}

const FriendsContext = createContext<FriendsContextProps | null>(null);

export const FriendsProvider = ({ children }: { children: JSX.Element }) => {
  const { apiClient } = useApiClient();

  const [friendsData, setFriendsData] = useState<FriendData[]>([]);

  const getFriends = async () => {
    const friendIds = await apiClient.getFriends();

    const newFriendsData: FriendData[] = [];
    for (const friendId of friendIds) {
      const drops = await apiClient.getDrops(friendId);
      const profile = await apiClient.getProfile(friendId);
      if (!profile) continue;
      newFriendsData.push({ friendId, profile, drops });
    }
    setFriendsData(newFriendsData);
  };

  const createFriend = async (friendId: string) => {
    const profile = await apiClient.createFriend(friendId);
    if (!profile) return;

    const drops = await apiClient.getDrops(friendId);
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
        getFriends,
        createFriend,
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
