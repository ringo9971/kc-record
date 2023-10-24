import { Circle, Rectangle } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { memo, useState } from 'react';

import { ShipInfo } from './ShipInfo';
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
      <Box display="flex" flexDirection="row">
        <Circle fontSize="large" style={{ color: color.color }} />
        <Rectangle fontSize="large" style={{ color: color.bgColor }} />
        <Typography sx={{ color: color.color, backgroundColor: color.bgColor }}>
          {color.comment}
        </Typography>
      </Box>
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
            <ListItemText>
              <ShipInfo ship={ship} />
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const NamedColorsDropsBox = memo(ColorsDropsBox);
export default NamedColorsDropsBox;
