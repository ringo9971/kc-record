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
  const { createRareDrop, getColor } = useRareContext();

  const [ship, setShip] = useState('');

  const color = getColor(id);

  const handleClick = () => {
    createRareDrop(ship, id);
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
      <ShipAutocomplete ship={ship} onShipChange={setShip} />
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
