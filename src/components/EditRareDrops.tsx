import { Circle, Rectangle } from '@mui/icons-material';
import { Box, Button, Popover, TextField, Typography } from '@mui/material';
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
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const handleAdd = () => {
    addRareColor(user, firestore, {
      color: color,
      bgColor: bgColor,
      comment: comment,
    });
  };
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const colorOpen = Boolean(colorAnchorEl);
  const handleColorClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setColorAnchorEl(event.currentTarget as unknown as HTMLButtonElement);
  };
  const handleColorClose = () => {
    setColorAnchorEl(null);
  };
  const [bgColorAnchorEl, setBgColorAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const bgColorOpen = Boolean(bgColorAnchorEl);
  const handleBgColorClick = (
    event: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    setBgColorAnchorEl(event.currentTarget as unknown as HTMLButtonElement);
  };
  const handleBgColorClose = () => {
    setBgColorAnchorEl(null);
  };

  return (
    <Box>
      <Typography>背景色と文字色の設定</Typography>
      <Box pt={2}>
        <Circle
          style={{
            color: color,
            border: '1px solid black',
            width: '50px',
            height: '50px',
          }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleColorClick(event)
          }
        />
        <Rectangle
          style={{
            color: bgColor,
            border: '1px solid black',
            width: '50px',
            height: '50px',
          }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleBgColorClick(event)
          }
        />
        <TextField
          placeholder="コメント"
          value={comment}
          sx={{ width: 200, backgroundColor: bgColor }}
          InputProps={{
            style: { color },
          }}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleAdd}>
          追加
        </Button>
        <Popover
          anchorEl={colorAnchorEl}
          open={colorOpen}
          onClose={handleColorClose}
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

        <Popover
          anchorEl={bgColorAnchorEl}
          open={bgColorOpen}
          onClose={handleBgColorClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2}>
            <SketchPicker
              color={bgColor}
              onChange={(bgColor: ColorResult) => setBgColor(bgColor.hex)}
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
