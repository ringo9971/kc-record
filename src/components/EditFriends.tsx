import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { createFriend } from '../api/createFriend';
import { getFriends } from '../api/getFriends';
import { getProfiles } from '../api/getProfile';
import { Profile } from '../api/types';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';

const EditFriends = () => {
  const { user } = useUser();
  const { firestore } = useFirebase();

  const [friendsProfile, setFriendsProfile] = useState<Profile[]>([]);
  const [friendId, setFriendId] = useState('');

  const handleClick = async () => {
    const profile = await createFriend(user, firestore, friendId);
    if (!profile) return;
    setFriendsProfile((preFriendsProfile) => {
      const newFriendsProfile = [...preFriendsProfile, profile];
      return newFriendsProfile;
    });
  };

  const fetchFriends = async () => {
    if (!user) return;
    const friendIds = await getFriends(user, firestore);
    const profiles = await getProfiles(user, firestore, friendIds);
    setFriendsProfile(profiles);
  };
  useEffect(() => {
    fetchFriends();
  }, [user]);

  if (!user) {
    return <></>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <TextField
          placeholder="フレンド ID"
          value={friendId}
          onChange={(e) => setFriendId(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={handleClick} sx={{ mt: 1 }}>
          フレンド追加
        </Button>
        <Box pt={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>名前</TableCell>
                  <TableCell>コメント</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {friendsProfile.map((profile) => (
                  <TableRow key={profile.name}>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>{profile.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

const NamedEditFriends = memo(EditFriends);
export default NamedEditFriends;
