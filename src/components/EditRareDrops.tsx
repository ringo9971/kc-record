import { Box, Button, TextField } from '@mui/material';
import { memo, useState } from 'react';

import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useRareContext } from '../lib/RareContext';

export const EditRareDrops = () => {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { rareDrops, addRareDrop } = useRareContext();

  const [ship, setShip] = useState('');
  const [rare, setRare] = useState('');

  const handleClick = () => {
    addRareDrop(user, firestore, ship, rare);
  };

  return (
    <Box>
      <TextField
        placeholder="ドロップ"
        value={ship}
        sx={{ width: 200 }}
        onChange={(e) => setShip(e.target.value)}
      />
      <TextField
        placeholder="レア"
        value={rare}
        sx={{ width: 200 }}
        onChange={(e) => setRare(e.target.value)}
      />
      <Button variant="contained" onClick={handleClick}>
        追加
      </Button>
      {Array.from(rareDrops.entries()).map(([ship, rare]) => (
        <Box key={ship}>
          {ship} {rare}
        </Box>
      ))}
    </Box>
  );
};

const NamedEditRareDrops = memo(EditRareDrops);
export default NamedEditRareDrops;
