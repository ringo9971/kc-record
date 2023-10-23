import { Circle } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import { memo, useState } from 'react';

import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useRareContext } from '../lib/RareContext';

interface ColorsDropsBoxProps {
  id: string;
  ships: string[];
}

export const ColorsDropsBox = ({ id, ships }: ColorsDropsBoxProps) => {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { addRareDrop, getColor } = useRareContext();

  const [ship, setShip] = useState('');

  const color = getColor(id);

  const handleClick = () => {
    addRareDrop(user, firestore, ship, id);
    setShip('');
  };

  return (
    <Box>
      <Circle fontSize="large" style={{ color: color.color }} />
      <TextField
        placeholder="ドロップ"
        value={ship}
        sx={{ width: 200 }}
        onChange={(e) => setShip(e.target.value)}
      />
      <Button variant="contained" onClick={handleClick}>
        追加
      </Button>

      <List>
        {ships.map((ship) => (
          <ListItem key={ship}>
            <ListItemText>{ship}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const NamedColorsDropsBox = memo(ColorsDropsBox);
export default NamedColorsDropsBox;
