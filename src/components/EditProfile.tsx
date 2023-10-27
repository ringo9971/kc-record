import { Box, Button, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { useUser } from '../hooks/useUser';
import { useApiClient } from '../lib/ApiClientContext';

const EditProfile = () => {
  const { apiClient } = useApiClient();

  const { user } = useUser();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleClick = () => {
    apiClient.createProfile(name, message);
  };

  const fetchProfile = async () => {
    const profile = await apiClient.getProfile();
    setName(profile?.name ?? '');
    setMessage(profile?.message ?? '');
  };
  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (!user) {
    return <></>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box>メールアドレス: {user.email}</Box>
        <TextField
          placeholder="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 2 }}
        />
        <TextField
          placeholder="メッセージ"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleClick} sx={{ mt: 1 }}>
          確定
        </Button>
      </Box>
    </Box>
  );
};

const NamedEditProfile = memo(EditProfile);
export default NamedEditProfile;
