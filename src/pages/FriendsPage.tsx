import { memo } from 'react';

import EditFriends from '../components/EditFriends';
import { useUser } from '../hooks/useUser';

const FrindsPage = () => {
  const { loading } = useUser();

  if (loading) {
    return <></>;
  }

  return <EditFriends />;
};

const NamedFrindsPage = memo(FrindsPage);
export default NamedFrindsPage;
