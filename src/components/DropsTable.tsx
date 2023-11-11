import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Autocomplete,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  memo,
  useState,
} from 'react';

import { ShowFilter } from './DropsDetail';
import ShipAutocomplete from './ShipAutocomplete';
import { ShipInfo } from './ShipInfo';
import { Drop } from '../api/types';
import { useDropsContext } from '../lib/DropsContext';
import { FriendData, useFriendsContext } from '../lib/FriendsContext';
import { formatTime } from '../utils/helpers';

interface DropsTableProps {
  drops: Drop[];
  friendDrops?: Drop[];
  friendData?: FriendData;
  outcomes: string[];
  eventsAreas: Map<string, string[]>;
  columnFilter: ShowFilter;
  isEdit: boolean;
  setFilteredDrops: Dispatch<SetStateAction<Drop[]>>;
  setDeleteDropShip: Dispatch<SetStateAction<Drop | null>>;
}

export const DropsTable = ({
  drops,
  friendDrops,
  friendData,
  outcomes,
  eventsAreas,
  columnFilter,
  isEdit,
  setFilteredDrops,
  setDeleteDropShip,
}: DropsTableProps): JSX.Element => {
  const { updateDrop } = useDropsContext();
  const { getFriends } = useFriendsContext();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editId, setEditId] = useState<string | null>(null);

  const [dropEdit, setDropEdit] = useState<Drop>({
    id: '',
    time: new Date(),
    event: '',
    area: '',
    outcome: '',
    ship: '',
    comment: '',
  });

  const maxDropsLength = Math.max(drops.length, friendDrops?.length ?? 0);

  const handleUpdateDrop = (dropId: string, preDrop: Drop, newDrop: Drop) => {
    if (!newDrop.event || !newDrop.area) return;
    updateDrop(dropId, preDrop, newDrop);
    setFilteredDrops(() =>
      drops.map((drop: Drop) => {
        if (drop.id === dropId) return newDrop;
        return drop;
      })
    );
    setEditId(null);
  };

  const handleReload = () => {
    getFriends();
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnFilter.event && <TableCell>イベント</TableCell>}
            {columnFilter.area && <TableCell>海域</TableCell>}
            {columnFilter.outcome && <TableCell>勝利</TableCell>}
            {columnFilter.ship && (
              <TableCell colSpan={friendData ? 2 : 1}>ドロップ</TableCell>
            )}
            {columnFilter.comment && <TableCell>コメント</TableCell>}
            {columnFilter.time && <TableCell>時間</TableCell>}
            {isEdit && <TableCell>編集</TableCell>}
            {isEdit && <TableCell>削除</TableCell>}
          </TableRow>
          {friendData && (
            <TableRow>
              {columnFilter.event && <TableCell></TableCell>}
              {columnFilter.area && <TableCell></TableCell>}
              {columnFilter.outcome && <TableCell></TableCell>}
              {columnFilter.ship && <TableCell>自分</TableCell>}
              {columnFilter.ship && (
                <TableCell>
                  {friendData?.profile.name}
                  <Button
                    onClick={handleReload}
                    size="small"
                    startIcon={<AutorenewIcon />}
                  />
                </TableCell>
              )}
              {columnFilter.comment && <TableCell></TableCell>}
              {columnFilter.time && <TableCell></TableCell>}
              {isEdit && <TableCell></TableCell>}
              {isEdit && <TableCell></TableCell>}
            </TableRow>
          )}
        </TableHead>
        <TableBody>
          {Array.from({ length: maxDropsLength }, (_, index) => {
            if (index < page * rowsPerPage || (page + 1) * rowsPerPage <= index)
              return;
            const drop = drops[index];
            const time = formatTime(drop?.time);

            const renderAutocompleteCell = (
              editValue: string,
              value: string,
              options: string[],
              onChangeFn: (
                _event: SyntheticEvent<Element, Event>,
                value: string
              ) => void
            ) => (
              <TableCell>
                {editId && editId === drop?.id ? (
                  <Autocomplete
                    value={editValue}
                    inputValue={editValue}
                    onInputChange={onChangeFn}
                    options={options}
                    getOptionLabel={(value: string) => value}
                    sx={{ width: 100 }}
                    freeSolo
                    renderInput={(params) => <TextField {...params} />}
                  />
                ) : (
                  <>{value}</>
                )}
              </TableCell>
            );

            const renderTextFiledCell = (
              editValue: string,
              value: string,
              onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void
            ) => (
              <TableCell>
                {editId && editId === drop?.id ? (
                  <TextField
                    value={editValue}
                    onChange={onChangeFn}
                    sx={{ width: 100 }}
                  />
                ) : (
                  <>{value}</>
                )}
              </TableCell>
            );

            return (
              <TableRow key={drop?.id ?? friendDrops?.[index]?.id}>
                {columnFilter.event &&
                  renderAutocompleteCell(
                    dropEdit.event,
                    drop?.event,
                    Array.from(eventsAreas.keys()).sort(),
                    (_, event) =>
                      setDropEdit((preDropEdit) => ({
                        ...preDropEdit,
                        event: event,
                      }))
                  )}
                {columnFilter.area &&
                  renderAutocompleteCell(
                    dropEdit.area,
                    drop?.area,
                    eventsAreas.get(dropEdit.event)?.sort() ?? [],
                    (_, area) =>
                      setDropEdit((preDropEdit) => ({
                        ...preDropEdit,
                        area: area,
                      }))
                  )}
                {columnFilter.outcome && (
                  <TableCell>
                    {editId && editId === drop?.id ? (
                      <Autocomplete
                        value={dropEdit.outcome}
                        onChange={(_, outcome) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            outcome: outcome ?? outcomes[0],
                          }))
                        }
                        options={outcomes}
                        getOptionLabel={(value: string) => value}
                        sx={{ width: 100 }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    ) : (
                      <>{drop?.outcome}</>
                    )}
                  </TableCell>
                )}
                {columnFilter.ship && (
                  <TableCell>
                    {editId && editId === drop?.id ? (
                      <ShipAutocomplete
                        ship={dropEdit.ship}
                        onShipChange={(ship: string) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            ship: ship,
                          }))
                        }
                      />
                    ) : (
                      <ShipInfo ship={drop?.ship} />
                    )}
                  </TableCell>
                )}
                {columnFilter.ship && friendData && (
                  <TableCell>
                    <ShipInfo ship={friendDrops?.[index]?.ship} />
                  </TableCell>
                )}
                {columnFilter.comment &&
                  renderTextFiledCell(
                    dropEdit.comment,
                    drop?.comment,
                    (e: React.ChangeEvent<HTMLInputElement>) =>
                      setDropEdit((preDropEdit) => ({
                        ...preDropEdit,
                        comment: e.target.value,
                      }))
                  )}
                {columnFilter.time && <TableCell>{time}</TableCell>}
                {isEdit && drop && (
                  <TableCell>
                    {editId && editId === drop.id ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleUpdateDrop(drop.id, drop, dropEdit)
                        }
                      >
                        変更
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setDropEdit(drop);
                          setEditId(drop.id);
                        }}
                      >
                        編集
                      </Button>
                    )}
                  </TableCell>
                )}
                {isEdit && drop && (
                  <TableCell>
                    <Button onClick={() => setDeleteDropShip(drop)}>
                      削除
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={maxDropsLength}
              onPageChange={(_event, newPage) => setPage(newPage)}
              page={page}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) =>
                setRowsPerPage(+event.target.value)
              }
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const NamedDropTable = memo(DropsTable);
export default NamedDropTable;
