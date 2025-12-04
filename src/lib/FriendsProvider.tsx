import { useState } from 'react';

import { FriendData, FriendsContext } from './FriendsContext.ts';
import { useApiClient } from '../hooks/useApiClient.ts';

export const FriendsProvider = ({ children }: { children: React.ReactNode}) => {
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
