import { Box } from '@mui/material';
import { useRareContext } from '../lib/RareContext';

interface ShipInfoProps {
  ship?: string;
}

export const ShipInfo = ({ ship }: ShipInfoProps) => {
  const { rareDrops } = useRareContext();

  const color = ship ? rareDrops.get(ship) ?? 'balck' : 'black';

  return <Box sx={{ color }}>{ship}</Box>;
};
