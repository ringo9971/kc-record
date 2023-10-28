import { Circle, Rectangle } from '@mui/icons-material';
import { Box, Button, Popover, TextField, Typography } from '@mui/material';
import { memo, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';

import ColorsDropsBox from './ColorsDropsBox';
import { useRareContext } from '../lib/RareContext';

export const EditRareDrops = () => {
  const { colorsDrops, createRareColor, rareColors } = useRareContext();

  const [comment, setComment] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const handleAdd = () => {
    createRareColor({ color, bgColor, comment });
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
      <Typography>文字色と背景色の設定</Typography>
      <Box pt={2}>
        <Box display="flex" flexDirection="row">
          <Circle
            style={{
              color: color,
              border: '1px solid lightgray',
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
              border: '1px solid lightgray',
              width: '50px',
              height: '50px',
            }}
            onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
              handleBgColorClick(event)
            }
          />
          <TextField
            placeholder="コメント（例: 海外艦）"
            value={comment}
            sx={{ width: 200, backgroundColor: bgColor, mx: 1 }}
            InputProps={{
              style: { color },
            }}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd} sx={{ mx: 1 }}>
            追加
          </Button>
        </Box>
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
