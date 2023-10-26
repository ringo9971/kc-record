import {
  FormControl,
  FormControlLabel,
  Grid,
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
        <Grid container style={{ width: '95%' }}>
          {options.map((option) => (
            <Grid item xs={2} key={option}>
              <FormControlLabel
                value={option}
                control={<Radio color="primary" />}
                label={option}
                labelPlacement="top"
              />
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </FormControl>
  );
};

const NamedRadioButtonGroup = memo(RadioButtonGroup);
export default NamedRadioButtonGroup;
