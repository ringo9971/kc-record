import { memo } from 'react';

import EditProfile from '../components/EditProfile';
import { useUser } from '../hooks/useUser';

const ProfilePage = () => {
  const { loading } = useUser();

  if (loading) {
    return <></>;
  }

  return <EditProfile />;
};

const NamedProfilePage = memo(ProfilePage);
export default NamedProfilePage;
