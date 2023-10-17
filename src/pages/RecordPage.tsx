import {
  Autocomplete,
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
import { getEventsAreas } from '../api/getEventsAreas';
import { DropRequest } from '../api/types';
import DropTable from '../components/DropTable';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useDropsContext } from '../lib/DropsContext';
import { useEventsAreasContext } from '../lib/EventsAreasContext';

export const RecordPage = (): JSX.Element => {
  const { user, loading } = useUser();
  const { firestore } = useFirebase();

  const { drops, setDrops, dropsProviderCreateDrop } = useDropsContext();
  const { eventsAreas, setEventsAreas } = useEventsAreasContext();

  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [outcome, setOutcome] = useState('S');
  const [ship, setShip] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (drops.length > 0 || loading) return;
    fetchDropsData();
    fetchEventsAreas();
  }, [user, drops.length, loading]);

  const fetchDropsData = async () => {
    const data = await getDrops(user, firestore);
    setDrops(data);
  };
  const fetchEventsAreas = async () => {
    const data = await getEventsAreas(user, firestore);
    setEventsAreas(data.results);
  };

  const handleCreateDrop = async () => {
    const drop: DropRequest = {
      event: event,
      area: area,
      outcome: outcome,
      ship: outcome === '撤退' ? '' : ship,
      comment: comment,
    };
    const newDrop = await createDrop(user, firestore, drop);
    if (!newDrop) return;
    dropsProviderCreateDrop(newDrop);
    setShip('');
    setComment('');
  };

  if (loading) {
    return <></>;
  }

  return (
    <>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row">
          <Autocomplete
            inputValue={event}
            onInputChange={(_, event) => {
              setEvent(event);
            }}
            options={Array.from(eventsAreas.keys())}
            getOptionLabel={(event: string) => event}
            freeSolo
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="イベント" placeholder="イベント" />
            )}
          />
          <Autocomplete
            inputValue={area}
            onInputChange={(_, area) => setArea(area)}
            options={eventsAreas.get(event) ?? []}
            getOptionLabel={(area: string) => area}
            freeSolo
            sx={{ width: 200 }}
            renderInput={(params) => (
              <TextField {...params} label="海域" placeholder="海域" />
            )}
          />
        </Box>
        <Box display="flex" flexDirection="row" pt={1}>
          <TextField
            disabled={outcome === '撤退'}
            placeholder="ドロップ"
            value={ship}
            sx={{ width: 200 }}
            onChange={(e) => setShip(e.target.value)}
          />
          <TextField
            placeholder="コメント"
            value={comment}
            sx={{ width: 200 }}
            onChange={(e) => setComment(e.target.value)}
          />
        </Box>
        <Box pt={2}>
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
      </Box>
      <Box pt={2}>
        <Button variant="contained" onClick={handleCreateDrop}>
          追加
        </Button>
      </Box>
      <Box pt={2}>
        <DropTable drops={drops} eventsAreas={eventsAreas} />
      </Box>
    </>
  );
};

const NamedRecordPage = memo(RecordPage);
export default NamedRecordPage;
