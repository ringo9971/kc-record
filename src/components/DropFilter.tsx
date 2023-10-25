import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
} from '@mui/material';
import { SyntheticEvent, memo } from 'react';

interface DropFilterProps {
  event: string;
  area: string;
  eventsAreas: Map<string, string[]>;
  outcomes: string[];
  outcomesFilter: string[];
  handleEventChange: (
    _: SyntheticEvent<Element, Event>,
    value: string | null
  ) => void;
  handleAreaChange: (
    _: SyntheticEvent<Element, Event>,
    value: string | null
  ) => void;
  handleOutcomesFilter: (outcome: string) => void;
}

export const DropFilter = ({
  event,
  area,
  eventsAreas,
  outcomes,
  outcomesFilter,
  handleEventChange,
  handleAreaChange,
  handleOutcomesFilter,
}: DropFilterProps) => {
  return (
    <Box>
      <Box display="flex" flexDirection="row">
        <Autocomplete
          options={['', ...Array.from(eventsAreas.keys()).sort()]}
          getOptionLabel={(event: string) => event}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="イベント"
              placeholder="イベント"
              size="small"
            />
          )}
          value={event}
          onChange={handleEventChange}
        />
        <Autocomplete
          options={['', ...(eventsAreas.get(event)?.sort() ?? [])]}
          getOptionLabel={(area: string) => area}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="海域"
              placeholder="海域"
              size="small"
            />
          )}
          value={area}
          onChange={handleAreaChange}
        />
      </Box>
      <FormGroup sx={{ direction: 'flex', flexDirection: 'row', pt: 2 }}>
        {outcomes.map((outcome) => (
          <FormControlLabel
            key={outcome}
            control={
              <Checkbox
                checked={outcomesFilter.includes(outcome)}
                onChange={() => handleOutcomesFilter(outcome)}
              />
            }
            label={outcome}
            labelPlacement="top"
          />
        ))}
      </FormGroup>
    </Box>
  );
};

const NamedDropFilter = memo(DropFilter);
export default NamedDropFilter;
