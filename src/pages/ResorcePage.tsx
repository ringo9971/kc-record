import { Box, Button } from '@mui/material';
import { memo, useState } from 'react';

import NumberField from '../components/NumberField';
import { useResourcesContext } from '../lib/ResourceContext';

export const ResourcePage = () => {
  const { createResource } = useResourcesContext();

  const [fuel, setFuel] = useState<number | null>(null);
  const [ammo, setAmmo] = useState<number | null>(null);
  const [steel, setSteel] = useState<number | null>(null);
  const [bauxite, setBauxite] = useState<number | null>(null);

  const [bucket, setBucket] = useState<number | null>(null);
  const [nail, setNail] = useState<number | null>(null);
  const [screw, setScrew] = useState<number | null>(null);

  const handleClick = () => {
    if (fuel === null || ammo === null || steel === null || bauxite === null)
      return;
    createResource({
      fuel,
      ammo,
      steel,
      bauxite,
      bucket: bucket ?? undefined,
      nail: nail ?? undefined,
      screw: screw ?? undefined,
    });
    setFuel(null);
    setAmmo(null);
    setSteel(null);
    setBauxite(null);
    setBucket(null);
    setNail(null);
    setScrew(null);
  };

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row">
          <NumberField value={fuel} setValue={setFuel} label="燃料" />
          <NumberField value={steel} setValue={setSteel} label="鋼材" />
        </Box>
        <Box display="flex" flexDirection="row" pt={1}>
          <NumberField value={ammo} setValue={setAmmo} label="弾薬" />
          <NumberField value={bauxite} setValue={setBauxite} label="ボーキ" />
        </Box>
        <Box display="flex" flexDirection="row" pt={1}>
          <NumberField value={bucket} setValue={setBucket} label="バケツ" />
          <NumberField value={nail} setValue={setNail} label="釘" />
          <NumberField value={screw} setValue={setScrew} label="ねじ" />
        </Box>
        <Box pt={1}>
          <Button variant="contained" onClick={handleClick}>
            追加
          </Button>
        </Box>
      </Box>
    </>
  );
};

const NamedResourcePage = memo(ResourcePage);
export default NamedResourcePage;
