import { memo } from 'react';

import EditProfile from '../components/EditProfile';

const ProfilePage = () => {
  return <EditProfile />;
};

const NamedProfilePage = memo(ProfilePage);
export default NamedProfilePage;
