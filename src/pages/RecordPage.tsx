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
import { DropsResponse, DropRequest } from '../api/types';
import DropTable from '../components/DropTable';
import { useUser } from '../hooks/useUser';

export const RecordPage = (): JSX.Element => {
  const { loading } = useUser();

  const [drops, setDrops] = useState<DropsResponse | null>(null);
  const [eventsAreas, setEventsAreas] = useState<Map<string, string[]>>(
    new Map()
  );

  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [outcome, setOutcome] = useState('S');
  const [ship, setShip] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchDropsData();
    fetchEventsAreas();
  }, []);

  const fetchDropsData = async () => {
    const data = await getDrops();
    setDrops(data);
  };
  const fetchEventsAreas = async () => {
    const data = await getEventsAreas();
    if (data) {
      setEventsAreas(data.results);
    }
  };

  const handleCreateDrop = async () => {
    const drop: DropRequest = {
      event: event,
      area: area,
      outcome: outcome,
      ship: outcome === '撤退' ? '' : ship,
      comment: comment,
    };
    await createDrop(drop);
    await fetchDropsData();
  };

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row">
              <Autocomplete
                value={event}
                inputValue={event}
                onInputChange={(_, event) => {
                  setEvent(event);
                }}
                options={Array.from(eventsAreas.keys())}
                getOptionLabel={(event: string) => event}
                onOpen={fetchEventsAreas}
                freeSolo
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="イベント"
                    placeholder="イベント"
                  />
                )}
              />
              <Autocomplete
                value={area}
                inputValue={area}
                onInputChange={(_, area) => setArea(area)}
                options={eventsAreas.get(event) ?? []}
                getOptionLabel={(area: string) => area}
                onOpen={fetchEventsAreas}
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
            <DropTable
              items={drops?.results}
              eventsAreas={eventsAreas}
              fetchEventsAreas={fetchEventsAreas}
            />
          </Box>
        </>
      )}
    </>
  );
};

const NamedRecordPage = memo(RecordPage);
export default NamedRecordPage;
