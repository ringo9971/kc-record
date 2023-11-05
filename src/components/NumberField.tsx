import { TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { memo } from 'react';

interface NumberFieldProps {
  value: number | null;
  setValue: Dispatch<SetStateAction<number | null>>;
  label: string;
}

const NumberField = ({
  value,
  setValue,
  label,
}: NumberFieldProps): JSX.Element => {
  return (
    <TextField
      placeholder={label}
      value={value ? value.toLocaleString() : ''}
      label={label}
      onChange={(e) =>
        setValue(Number(e.target.value.replace(/[^\u4e00-\u9fa5\d]/gu, '')))
      }
    />
  );
};

const NamedNumberField = memo(NumberField);
export default NamedNumberField;
