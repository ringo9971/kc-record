import { memo } from 'react';

import EditRareDrops from '../components/EditRareDrops';

const SettingsPage = () => {
  return <EditRareDrops />;
};

const NamedSettingsPage = memo(SettingsPage);
export default NamedSettingsPage;
