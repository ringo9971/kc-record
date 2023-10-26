import { Box, Button, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';

import { DropRequest } from '../api/types';
import DropTable from '../components/DropTable';
import FreeAutocomplete from '../components/FreeAutocomplete';
import RadioButtonGroup from '../components/RadioButtonGroup';
import ShipAutocomplete from '../components/ShipAutocomplete';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useDropsContext } from '../lib/DropsContext';
import { useEventsAreasContext } from '../lib/EventsAreasContext';
import { useFriendsContext } from '../lib/FriendsContext';
import { useRareContext } from '../lib/RareContext';

export const RecordPage = (): JSX.Element => {
  const { user, loading } = useUser();
  const { firestore } = useFirebase();

  const { drops, getDrops, createDrop } = useDropsContext();
  const { eventsAreas, getEventsAreas } = useEventsAreasContext();

  const { fetchFriends } = useFriendsContext();
  const { fetchRareDrops } = useRareContext();

  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [outcome, setOutcome] = useState('S');
  const [ship, setShip] = useState('');
  const [comment, setComment] = useState('');

  const outcomes = ['S', 'A', 'B', '敗北', '撤退', '不明'];

  useEffect(() => {
    if (drops.length > 0 || loading || !user) return;
    getDrops();
    getEventsAreas();
    fetchFriends(user, firestore);
    fetchRareDrops(user, firestore);
  }, [user, drops.length, loading, user]);

  const handleCreateDrop = async () => {
    const drop: DropRequest = {
      event: event,
      area: area,
      outcome: outcome,
      ship: outcome === '撤退' ? '' : ship,
      comment: comment,
    };
    const newDrop = await createDrop(drop);
    if (!newDrop) return;
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
          <FreeAutocomplete
            inputValue={event}
            options={Array.from(eventsAreas.keys()).sort()}
            onInputChange={(_, event) => setEvent(event)}
            label="イベント"
          />
          <FreeAutocomplete
            inputValue={area}
            options={eventsAreas.get(event)?.sort() ?? []}
            onInputChange={(_, area) => setArea(area)}
            label="海域"
          />
        </Box>
        <Box display="flex" flexDirection="row" pt={1}>
          <ShipAutocomplete
            ship={ship}
            onShipChange={setShip}
            disabled={outcome === '撤退'}
          />
          <TextField
            placeholder="コメント"
            value={comment}
            sx={{ width: 200 }}
            onChange={(e) => setComment(e.target.value)}
          />
        </Box>
        <Box pt={2}>
          <RadioButtonGroup
            options={outcomes}
            onChange={(e) => setOutcome(e.target.value)}
          />
        </Box>
      </Box>
      <Box pt={2}>
        <Button variant="contained" onClick={handleCreateDrop}>
          追加
        </Button>
      </Box>
      <Box pt={2}>
        <DropTable
          drops={drops}
          outcomes={outcomes}
          eventsAreas={eventsAreas}
        />
      </Box>
    </>
  );
};

const NamedRecordPage = memo(RecordPage);
export default NamedRecordPage;
