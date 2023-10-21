import { memo } from 'react';

import EditRareDrops from '../components/EditRareDrops';
import { useUser } from '../hooks/useUser';

const SettingsPage = () => {
  const { user } = useUser();

  if (!user) {
    return <></>;
  }

  return <EditRareDrops />;
};

const NamedSettingsPage = memo(SettingsPage);
export default NamedSettingsPage;
