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
  const [isColumnFilterOpen, setIsColumnFilterOpen] = useState(false);
  const [columnFilter, setColumnFilter] = useState<ShowFilter>({
    event: true,
    area: true,
    outcome: true,
    ship: true,
    comment: false,
    time: false,
  });
  const columnList = [
    'イベント',
    '海域',
    '勝利',
    'ドロップ',
    'コメント',
    '時間',
  ];
  const columnMap: { [column: string]: keyof ShowFilter } = {
    イベント: 'event',
    海域: 'area',
    勝利: 'outcome',
    ドロップ: 'ship',
    コメント: 'comment',
    時間: 'time',
  };

  const handleColumnFilterChange = (filterName: keyof ShowFilter) => {
    setColumnFilter((prevFilter) => ({
      ...prevFilter,
      [filterName]: !prevFilter[filterName],
    }));
  };
  const columnToFilterKey = (column: string) => {
    return columnMap[column] || 'event';
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setIsColumnFilterOpen((preFilterOpen) => !preFilterOpen)}
      >
        フィルタ
      </Button>
      <Modal
        open={isColumnFilterOpen}
        onClose={() => setIsColumnFilterOpen(false)}
        closeAfterTransition
      >
        <Box sx={style}>
          <FormGroup>
            {columnList.map((column) => (
              <FormControlLabel
                key={column}
                control={
                  <Checkbox
                    checked={columnFilter[columnToFilterKey(column)]}
                    onClick={() =>
                      handleColumnFilterChange(columnToFilterKey(column))
                    }
                  />
                }
                label={column}
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
                {columnFilter.event && <TableCell>イベント</TableCell>}
                {columnFilter.area && <TableCell>海域</TableCell>}
                {columnFilter.outcome && <TableCell>勝利</TableCell>}
                {columnFilter.ship && <TableCell>ドロップ</TableCell>}
                {columnFilter.comment && <TableCell>コメント</TableCell>}
                {columnFilter.time && <TableCell>時間</TableCell>}
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
                    {columnFilter.event && <TableCell>{drop.event}</TableCell>}
                    {columnFilter.area && <TableCell>{drop.area}</TableCell>}
                    {columnFilter.outcome && (
                      <TableCell>{drop.outcome}</TableCell>
                    )}
                    {columnFilter.ship && <TableCell>{drop.ship}</TableCell>}
                    {columnFilter.comment && (
                      <TableCell>{drop.comment}</TableCell>
                    )}
                    {columnFilter.time && <TableCell>{time}</TableCell>}
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
