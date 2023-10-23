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
  const { colorsDrops, addRareColor, rareColors } = useRareContext();

  const [comment, setComment] = useState('');
  const [color, setColor] = useState('#000000');

  const handleAdd = () => {
    addRareColor(user, firestore, {
      color: color,
      bgColor: '#FFFFFF',
      comment: comment,
    });
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
          style={{ color: color, width: '50px', height: '50px' }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleClick(event)
          }
        />
        <TextField
          placeholder="コメント"
          value={comment}
          sx={{ width: 200 }}
          onChange={(e) => setComment(e.target.value)}
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
              color={color}
              onChange={(color: ColorResult) => setColor(color.hex)}
            />
          </Box>
        </Popover>
      </Box>
      <Box pt={2}>
        {Array.from(rareColors.keys()).map((id) => (
          <ColorsDropsBox key={id} id={id} ships={colorsDrops.get(id) ?? []} />
        ))}
      </Box>
    </Box>
  );
};

const NamedEditRareDrops = memo(EditRareDrops);
export default NamedEditRareDrops;
