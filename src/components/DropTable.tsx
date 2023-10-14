import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { memo, useState } from 'react';

import { Drop } from '../api/types';

const style = {
  position: 'absolute',
  top: '40%',
  down: '10%',
  left: '10%',
  right: '10%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

interface DropsItemConfig {
  items?: Drop[];
}

interface ShowFilter {
  event: boolean;
  area: boolean;
  outcome: boolean;
  ship: boolean;
  comment: boolean;
  time: boolean;
}

export const DropTable = (props: DropsItemConfig | undefined): JSX.Element => {
  const [click, setClick] = useState(false);

  const [showFilter, setShowFilter] = useState<ShowFilter>({
    event: true,
    area: true,
    outcome: true,
    ship: true,
    comment: false,
    time: false,
  });
  const showList = ['イベント', '海域', '勝利', 'ドロップ', 'コメント', '時間'];
  const keyMap: { [key: string]: keyof ShowFilter } = {
    イベント: 'event',
    海域: 'area',
    勝利: 'outcome',
    ドロップ: 'ship',
    コメント: 'comment',
    時間: 'time',
  };

  const handleCheckboxChange = (filterName: keyof ShowFilter) => {
    setShowFilter((prevFilter) => ({
      ...prevFilter,
      [filterName]: !prevFilter[filterName],
    }));
  };
  const stringToFilterKey = (show: string) => {
    return keyMap[show] || 'event';
  };

  return (
    <Box display="flex" flexDirection="column">
      <Button
        variant="contained"
        onClick={() => setClick((preClick) => !preClick)}
      >
        フィルタ
      </Button>
      <Modal open={click} onClose={() => setClick(false)} closeAfterTransition>
        <Box sx={style}>
          <FormGroup>
            {showList.map((show) => (
              <FormControlLabel
                key={show}
                control={
                  <Checkbox
                    checked={showFilter[stringToFilterKey(show)]}
                    onClick={() =>
                      handleCheckboxChange(stringToFilterKey(show))
                    }
                  />
                }
                label={show}
                labelPlacement="top"
              />
            ))}
          </FormGroup>
        </Box>
      </Modal>
      <Box pt={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {showFilter.event && <TableCell>イベント</TableCell>}
                {showFilter.area && <TableCell>海域</TableCell>}
                {showFilter.outcome && <TableCell>勝利</TableCell>}
                {showFilter.ship && <TableCell>ドロップ</TableCell>}
                {showFilter.comment && <TableCell>コメント</TableCell>}
                {showFilter.time && <TableCell>時間</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {props?.items?.map((drop) => {
                const time = new Date(drop.time).toLocaleString('jp-JP', {
                  timeZone: 'Asia/Tokyo',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <TableRow key={drop.id}>
                    {showFilter.event && <TableCell>{drop.event}</TableCell>}
                    {showFilter.area && <TableCell>{drop.area}</TableCell>}
                    {showFilter.outcome && (
                      <TableCell>{drop.outcome}</TableCell>
                    )}
                    {showFilter.ship && <TableCell>{drop.ship}</TableCell>}
                    {showFilter.comment && (
                      <TableCell>{drop.comment}</TableCell>
                    )}
                    {showFilter.time && <TableCell>{time}</TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const NamedDropTable = memo(DropTable);
export default NamedDropTable;
