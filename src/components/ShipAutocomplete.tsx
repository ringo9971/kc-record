import { Autocomplete, FilterOptionsState, TextField } from '@mui/material';
import { memo, useEffect } from 'react';

import { ShipMaster, useMasterContext } from '../lib/MasterContext';
import {
  hiraganaToKatakana,
  isPartialMatch,
  katakanaToHiragana,
} from '../utils/helpers';

interface ShipAutocompleteProps {
  ship: string;
  onShipChange: (ship: string) => void;
  disabled?: boolean;
}

export const ShipAutocomplete = ({
  ship,
  onShipChange,
  disabled,
}: ShipAutocompleteProps) => {
  const { shipsMaster } = useMasterContext();

  const filterOptions = (
    options: ShipMaster[],
    { inputValue }: FilterOptionsState<ShipMaster>
  ) => {
    const matches = options.filter((option) => {
      const value = `${option.name} ${katakanaToHiragana(
        option.yomi
      )} ${hiraganaToKatakana(option.yomi)}`;
      return isPartialMatch(value, inputValue);
    });
    return matches;
  };

  useEffect(() => {
    onShipChange(ship);
  }, [ship, onShipChange]);

  return (
    <Autocomplete
      inputValue={ship}
      onInputChange={(_, selectedShip: string) => {
        onShipChange(selectedShip);
      }}
      autoSelect
      options={shipsMaster}
      getOptionLabel={(option: ShipMaster) => option.name}
      filterOptions={filterOptions}
      sx={{ width: 200 }}
      disabled={disabled}
      renderInput={(params) => (
        <TextField {...params} label="ドロップ" placeholder="ドロップ" />
      )}
    />
  );
};

const NamedShipAutocomplete = memo(ShipAutocomplete);
export default NamedShipAutocomplete;
