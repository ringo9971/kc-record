import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { createDrop } from '../api/createDrop';
import { getDrops } from '../api/getDrops';
import { DropsResponse, DropRequest } from '../api/types';
import DropTable from '../components/DropTable';

export const RecordPage = (): JSX.Element => {
  const [drops, setDrops] = useState<DropsResponse | null>(null);

  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [outcome, setOutcome] = useState('S');
  const [ship, setShip] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchDropsData();
  }, []);

  const fetchDropsData = async () => {
    const data = await getDrops();
    setDrops(data);
  };

  const handleCreateDrop = async () => {
    const drop: DropRequest = {
      event: event,
      area: area,
      outcome: outcome,
      ship: ship,
      comment: comment,
    };
    await createDrop(drop);
    fetchDropsData();
  };

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box display="flex" flexDirection="column">
          <TextField
            placeholder="イベント"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
          />
          <TextField
            placeholder="海域"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </Box>
        <Box display="flex" flexDirection="column">
          <TextField
            placeholder="ドロップ"
            value={ship}
            onChange={(e) => setShip(e.target.value)}
          />
          <TextField
            placeholder="コメント"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Box>
        <FormControl component="fieldset">
          <RadioGroup
            row
            defaultValue="S"
            onChange={(e) => setOutcome(e.target.value)}
          >
            <FormControlLabel
              value="S"
              control={<Radio color="primary" />}
              label="S"
              labelPlacement="top"
            />
            <FormControlLabel
              value="A"
              control={<Radio color="primary" />}
              label="A"
              labelPlacement="top"
            />
            <FormControlLabel
              value="B"
              control={<Radio color="primary" />}
              label="B"
              labelPlacement="top"
            />
            <FormControlLabel
              value="撤退"
              control={<Radio color="primary" />}
              label="撤退"
              labelPlacement="top"
            />
            <FormControlLabel
              value="不明"
              control={<Radio color="primary" />}
              label="不明"
              labelPlacement="top"
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box>
        <Button variant="contained" onClick={handleCreateDrop}>
          追加
        </Button>
      </Box>
      <Box pt={2}>
        <DropTable items={drops?.results} />
      </Box>
    </>
  );
};

const NamedRecordPage = memo(RecordPage);
export default NamedRecordPage;
