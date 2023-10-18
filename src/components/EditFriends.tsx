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

import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useFriendsContext } from '../lib/FriendsContext';

const EditFriends = () => {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { friendsData, addFriend, fetchFriends } = useFriendsContext();

  const [friendId, setFriendId] = useState('');

  const handleClick = async () => {
    if (!user) return;
    addFriend(user, firestore, friendId);
  };

  const _fetchFriends = async () => {
    if (!user || friendsData.length > 0) return;
    fetchFriends(user, firestore);
  };
  useEffect(() => {
    _fetchFriends();
  }, [user, friendsData.length]);

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
                {friendsData.map(({ profile }) => (
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
