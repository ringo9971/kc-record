import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { memo } from 'react';

import { Drop } from '../api/types';
interface DropsItemConfig {
  items?: Drop[];
}

export const DropTable = (props: DropsItemConfig | undefined): JSX.Element => {
  return (
    <Box display="flex" flexDirection="column">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>イベント</TableCell>
              <TableCell>海域</TableCell>
              <TableCell>勝利</TableCell>
              <TableCell>ドロップ</TableCell>
              <TableCell>コメント</TableCell>
              <TableCell>時間</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.items?.map((drop) => (
              <TableRow key={drop.id}>
                <TableCell>{drop.event}</TableCell>
                <TableCell>{drop.area}</TableCell>
                <TableCell>{drop.outcome}</TableCell>
                <TableCell>{drop.ship}</TableCell>
                <TableCell>{drop.comment}</TableCell>
                <TableCell>{drop.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const NamedDropTable = memo(DropTable);
export default NamedDropTable;
