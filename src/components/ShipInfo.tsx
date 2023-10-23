import { Box } from '@mui/material';

import { useRareContext } from '../lib/RareContext';

interface ShipInfoProps {
  ship?: string;
}

export const ShipInfo = ({ ship }: ShipInfoProps) => {
  const { getColorByShip } = useRareContext();

  const color = getColorByShip(ship);

  return <Box sx={{ color }}>{ship}</Box>;
};
