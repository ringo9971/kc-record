import { Autocomplete, TextField, createFilterOptions } from '@mui/material';
import { memo, useEffect } from 'react';

import { ShipMaster, useMasterContext } from '../lib/MasterContext';

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

  const hiraganaToKatakana = (text: string) => {
    return text.replace(/[\u3041-\u3096]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) + 0x60)
    );
  };
  const katakanaToHiragana = (text: string) => {
    return text.replace(/[\u30a1-\u30f6]/g, (match) =>
      String.fromCharCode(match.charCodeAt(0) - 0x60)
    );
  };

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: { name: string; yomi: string }) =>
      `${option.name} ${katakanaToHiragana(option.yomi)} ${hiraganaToKatakana(
        option.yomi
      )}`,
  });

  useEffect(() => {
    onShipChange(ship);
  }, [ship, onShipChange]);

  return (
    <>
      <Autocomplete
        inputValue={ship}
        onInputChange={(_, selectedShip: string) => {
          onShipChange(selectedShip);
        }}
        options={shipsMaster}
        getOptionLabel={(option: ShipMaster) => option.name}
        filterOptions={filterOptions}
        sx={{ width: 200 }}
        disabled={disabled}
        renderInput={(params) => (
          <TextField {...params} label="ドロップ" placeholder="ドロップ" />
        )}
      />
    </>
  );
};

const NamedShipAutocomplete = memo(ShipAutocomplete);
export default NamedShipAutocomplete;
