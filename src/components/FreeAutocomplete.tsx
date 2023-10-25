import { Autocomplete, TextField } from '@mui/material';
import { SyntheticEvent, memo } from 'react';

interface FreeAutocompleteProps {
  inputValue: string;
  options: string[];
  onInputChange: (_: SyntheticEvent<Element, Event>, input: string) => void;
  label: string;
}

export const FreeAutocomplete = ({
  inputValue,
  options,
  onInputChange,
  label,
}: FreeAutocompleteProps) => {
  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={onInputChange}
      options={options}
      getOptionLabel={(event: string) => event}
      freeSolo
      sx={{ width: 200 }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={label} />
      )}
    />
  );
};

const NamedFreeAutocomplete = memo(FreeAutocomplete);
export default NamedFreeAutocomplete;
