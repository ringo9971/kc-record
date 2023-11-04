import { Autocomplete, FilterOptionsState, TextField } from '@mui/material';
import { memo, useEffect } from 'react';

import { ShipMaster, useMasterContext } from '../lib/MasterContext';
import {
  hiraganaToKatakana,
  hiraganaToRomaji,
  isPartialMatch,
  katakanaToHiragana,
} from '../utils/helpers';

interface ShipAutocompleteProps {
  ship: string;
  onShipChange: (ship: string) => void;
  disabled?: boolean;
  options?: ShipMaster[];
}

export const ShipAutocomplete = ({
  ship,
  onShipChange,
  disabled,
  options,
}: ShipAutocompleteProps) => {
  const { shipsMaster } = useMasterContext();

  const filterOptions = (
    options: ShipMaster[],
    { inputValue }: FilterOptionsState<ShipMaster>
  ) => {
    const matches = options.filter((option) => {
      const hiragana = katakanaToHiragana(option.yomi);
      const katakana = hiraganaToKatakana(option.yomi);
      const romaji = hiraganaToRomaji(hiragana);
      return (
        isPartialMatch(option.name, inputValue) ||
        isPartialMatch(hiragana, inputValue) ||
        isPartialMatch(katakana, inputValue) ||
        isPartialMatch(romaji, inputValue)
      );
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
      options={options ?? shipsMaster}
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
