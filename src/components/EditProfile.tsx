import { Box, Button, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { createProfile } from '../api/createProfile';
import { getProfile } from '../api/getProfile';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';

const EditProfile = () => {
  const { user } = useUser();
  const { firestore } = useFirebase();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleClick = () => {
    createProfile(user, firestore, name, message);
  };

  const fetchProfile = async () => {
    if (!user) return;
    const profile = await getProfile(user, firestore);
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
