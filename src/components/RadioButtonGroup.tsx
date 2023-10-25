import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface RadioButtonGroupProps {
  options: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const RadioButtonGroup = ({
  options,
  onChange,
}: RadioButtonGroupProps) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup row defaultValue={options[0]} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio color="primary" />}
            label={option}
            labelPlacement="top"
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

const NamedRadioButtonGroup = memo(RadioButtonGroup);
export default NamedRadioButtonGroup;
