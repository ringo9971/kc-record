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
import { memo, useState } from 'react';

import { useUser } from '../hooks/useUser';
import { useFriendsContext } from '../lib/FriendsContext';

const EditFriends = () => {
  const { friendsData, createFriend } = useFriendsContext();
  const { user } = useUser();

  const [friendId, setFriendId] = useState('');

  const handleClick = async () => {
    createFriend(friendId);
  };

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
