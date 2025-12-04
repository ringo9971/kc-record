import { createContext, Dispatch, SetStateAction } from 'react';

import { Drop, Profile } from '../api/types';

export interface FriendData {
  friendId: string;
  profile: Profile;
  drops: Drop[];
}

export interface FriendsContextProps {
  friendsData: FriendData[];
  setFriendsData: Dispatch<SetStateAction<FriendData[]>>;
  getFriends: () => void;
  createFriend: (friendId: string) => void;
}

export const FriendsContext = createContext<FriendsContextProps | null>(null);
