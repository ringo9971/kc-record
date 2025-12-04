import { memo } from 'react';

import AuthLogin from '../components/auth/AuthLogin';
import { useUser } from '../hooks/useUser';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  return (
    <>
      {user ? (
        <Box>
          <Typography>ログイン済みです</Typography>
          <Button onClick={() => navigate('/')}>ドロップ記録はこちら</Button>
        </Box>
      ) : (
        <AuthLogin />
      )}
    </>
  );
};

const NamedLoginPage = memo(LoginPage);
export default NamedLoginPage;
