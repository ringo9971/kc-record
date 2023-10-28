import { Circle, Rectangle } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { memo, useState } from 'react';

import ShipAutocomplete from './ShipAutocomplete';
import { ShipInfo } from './ShipInfo';
import { useRareContext } from '../lib/RareContext';

interface ColorsDropsBoxProps {
  id: string;
  ships: string[];
}

export const ColorsDropsBox = ({ id, ships }: ColorsDropsBoxProps) => {
  const { createRareDrop, deleteRareDrop, getColor } = useRareContext();

  const [ship, setShip] = useState('');

  const color = getColor(id);

  const handleAdd = () => {
    createRareDrop(ship, id);
    setShip('');
  };
  const handleDelete = (ship: string) => {
    deleteRareDrop(ship);
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
      <Box display="flex" flexDirection="row">
        <ShipAutocomplete ship={ship} onShipChange={setShip} />
        <Button variant="contained" onClick={handleAdd} sx={{ mx: 1 }}>
          追加
        </Button>
      </Box>

      <List>
        {ships.map((ship) => (
          <ListItem key={ship}>
            <ListItemText>
              <Box display="flex" flexDirection="row">
                <ShipInfo ship={ship} />
                <Button onClick={() => handleDelete(ship)}>削除</Button>
              </Box>
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const NamedColorsDropsBox = memo(ColorsDropsBox);
export default NamedColorsDropsBox;
