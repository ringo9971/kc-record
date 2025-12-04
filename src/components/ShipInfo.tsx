import { Box } from '@mui/material';

import { useRare } from '../hooks/useRare';

interface ShipInfoProps {
  ship?: string;
}

export const ShipInfo = ({ ship }: ShipInfoProps) => {
  const { getColorByShip } = useRare();

  const color = getColorByShip(ship);

  return (
    <Box sx={{ color: color.color, backgroundColor: color.bgColor }}>
      {ship}
    </Box>
  );
};
