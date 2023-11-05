import { Box, Tab, Tabs } from '@mui/material';
import { memo, useState } from 'react';

import RecordPage from './RecordPage';
import { ResourcePage } from './ResorcePage';

export const MainPage = () => {
  const [tabpage, setTabpage] = useState(0);

  return (
    <Box>
      <Tabs value={tabpage} onChange={(_, newValue) => setTabpage(newValue)}>
        <Tab label="ドロップ" />
        <Tab label="資源" />
      </Tabs>
      <Box mt={3}>
        {tabpage === 0 && <RecordPage />}
        {tabpage === 1 && <ResourcePage />}
      </Box>
    </Box>
  );
};

const NamedMainPage = memo(MainPage);
export default NamedMainPage;
