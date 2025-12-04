import { useContext } from 'react';

import { FriendsContext, FriendsContextProps } from '../lib/FriendsContext.ts';

export const useFriends = (): FriendsContextProps => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
