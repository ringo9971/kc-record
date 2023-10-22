import { Circle } from '@mui/icons-material';
import { Box, Button, Popover, TextField } from '@mui/material';
import { memo, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import ColorsDropsBox from './ColorsDropsBox';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useRareContext } from '../lib/RareContext';

export const EditRareDrops = () => {
  const { user } = useUser();
  const { firestore } = useFirebase();
  const { colorsDrops, addRareDrop } = useRareContext();

  const [ship, setShip] = useState('');
  const [rare, setRare] = useState('#000000');

  const handleAdd = () => {
    addRareDrop(user, firestore, ship, rare);
  };
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget as unknown as HTMLButtonElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box>
        <Circle
          style={{ color: rare, width: '50px', height: '50px' }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleClick(event)
          }
        />
        <TextField
          placeholder="ドロップ"
          value={ship}
          sx={{ width: 200 }}
          onChange={(e) => setShip(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          追加
        </Button>
        <Popover
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <SketchPicker
              color={rare}
              onChange={(color: ColorResult) => setRare(color.hex)}
            />
          </Box>
        </Popover>
      </Box>
      <Box pt={2}>
        {Array.from(colorsDrops.keys()).map((color) => (
          <ColorsDropsBox
            key={color}
            color={color}
            ships={colorsDrops.get(color) ?? []}
          />
        ))}
      </Box>
    </Box>
  );
};

const NamedEditRareDrops = memo(EditRareDrops);
export default NamedEditRareDrops;
