import { memo } from 'react';

import EditFriends from '../components/EditFriends';

const FrindsPage = () => {
  return <EditFriends />;
};

const NamedFrindsPage = memo(FrindsPage);
export default NamedFrindsPage;
