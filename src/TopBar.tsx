import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from './hooks/useUser';

const TopBar = (): JSX.Element => {
  const { user } = useUser();

  return (
    <Box mb={3}>
      <AppBar position="static">
        <Toolbar>
          <Box flexGrow="1">ドロップ記録</Box>
          {user ? (
            'ログイン済み'
          ) : (
            <Button component={Link} to="/login" color="inherit">
              ログインはこちらから
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const NamedTopBar = memo(TopBar);
export default NamedTopBar;
