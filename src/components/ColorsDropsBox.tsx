import { Circle, Rectangle } from '@mui/icons-material';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { v4 as uuidv4 } from 'uuid';

import ShipAutocomplete from './ShipAutocomplete';
import { ShipInfo } from './ShipInfo';
import { useMasterContext } from '../lib/MasterContext';
import { useRareContext } from '../lib/RareContext';

interface ColorsDropsBoxProps {
  id: string;
  ships: string[];
}

export const ColorsDropsBox = ({ id, ships }: ColorsDropsBoxProps) => {
  const { shipsMaster } = useMasterContext();
  const {
    rareDrops,
    createRareDrop,
    deleteRareDrop,
    getColor,
    updateRareColor,
  } = useRareContext();

  const [options, setOptions] = useState(shipsMaster);

  const [ship, setShip] = useState('');
  const [shipKey, setShipKey] = useState(uuidv4());

  const color = getColor(id);

  const [updateColor, setUpdateColor] = useState(color.color);
  const [updateBgColor, setUpdateBgColor] = useState(color.bgColor);

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

  const handleChangeColor = () => {
    updateRareColor(id, {
      ...color,
      color: updateColor,
      bgColor: updateBgColor,
    });
  };
  const handleAdd = () => {
    createRareDrop(ship, id);
    setShip('');
    setShipKey(uuidv4());
  };
  const handleDelete = (ship: string) => {
    deleteRareDrop(ship);
  };

  useEffect(() => {
    const options = shipsMaster.filter((master) => !rareDrops.get(master.name));
    setOptions(options);
  }, [rareDrops, shipsMaster]);

  return (
    <Box>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Circle
          fontSize="large"
          style={{ color: updateColor, border: '1px solid lightgray' }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleColorClick(event)
          }
        />
        <Rectangle
          fontSize="large"
          style={{ color: updateBgColor, border: '1px solid lightgray' }}
          onClick={(event: React.MouseEvent<SVGSVGElement, MouseEvent>) =>
            handleBgColorClick(event)
          }
        />
        <Typography
          sx={{
            color: updateColor,
            backgroundColor: updateBgColor,
            mx: 1,
          }}
        >
          {color.comment}
        </Typography>
        <Button
          variant="outlined"
          disabled={
            color.color === updateColor && color.bgColor === updateBgColor
          }
          onClick={handleChangeColor}
        >
          更新
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
            color={updateColor}
            onChange={(color: ColorResult) => setUpdateColor(color.hex)}
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
            color={updateBgColor}
            onChange={(bgColor: ColorResult) => setUpdateBgColor(bgColor.hex)}
          />
        </Box>
      </Popover>
      <Box display="flex" flexDirection="row" key={shipKey}>
        <ShipAutocomplete
          ship={ship}
          onShipChange={setShip}
          options={options}
        />
        <Button variant="contained" onClick={handleAdd} sx={{ mx: 1 }}>
          追加
        </Button>
      </Box>

      <List>
        {ships.map((ship) => (
          <ListItem key={ship}>
            <ListItemText>
              <Box display="flex" flexDirection="row" alignItems="center">
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
