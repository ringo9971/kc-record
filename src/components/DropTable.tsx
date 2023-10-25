import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { SyntheticEvent, memo, useEffect, useState } from 'react';

import DropFilter from './DropFilter';
import ShipAutocomplete from './ShipAutocomplete';
import { ShipInfo } from './ShipInfo';
import { Drop } from '../api/types';
import { updateDrop } from '../api/updateDrop';
import useFirebase from '../hooks/useFirebase';
import { useUser } from '../hooks/useUser';
import { useDropsContext } from '../lib/DropsContext';
import { useFriendsContext } from '../lib/FriendsContext';

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
  drops: Drop[];
  outcomes: string[];
  eventsAreas: Map<string, string[]>;
}

interface ShowFilter {
  event: boolean;
  area: boolean;
  outcome: boolean;
  ship: boolean;
  comment: boolean;
  time: boolean;
}

export const DropTable = ({
  drops,
  outcomes,
  eventsAreas,
}: DropsItemConfig): JSX.Element => {
  const { user } = useUser();
  const { firestore } = useFirebase();

  const { friendsData } = useFriendsContext();
  const [filteredFriendData, setFilteredFriendData] = useState<Drop[]>(
    friendsData?.[0]?.drops ?? []
  );

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

  const { dropsProviderUpdateDrop } = useDropsContext();
  const [isDropFilterOpen, setIsDropFilterOpen] = useState(false);
  const [filteredDrops, setFilteredDrops] = useState<Drop[]>(drops);
  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');
  const [maxDropsLength, setMaxDropsLength] = useState(
    Math.max(filteredDrops.length, filteredFriendData.length)
  );

  const [outcomesFilter, setOutcomesFilter] = useState<string[]>([]);

  const [isEdit, setIsEdit] = useState(false);
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

  const handleUpdateDrop = (dropId: string, preDrop: Drop, newDrop: Drop) => {
    if (!newDrop.event || !newDrop.area) return;
    updateDrop(user, firestore, dropId, preDrop, newDrop);
    dropsProviderUpdateDrop(dropId, preDrop, newDrop);
    setFilteredDrops(() =>
      drops.map((drop: Drop) => {
        if (drop.id === dropId) return newDrop;
        return drop;
      })
    );
    setEditId(null);
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

  const handleOutcomesFilter = (outcome: string) => {
    const isSelected = outcomesFilter.includes(outcome);

    if (!isSelected) {
      setOutcomesFilter([...outcomesFilter, outcome]);
    } else {
      setOutcomesFilter(
        outcomesFilter.filter((selectedItem) => selectedItem !== outcome)
      );
    }
  };

  const filterDrops = (
    drops: Drop[] = [],
    outcomesFilter: string[],
    event: string,
    area: string
  ) => {
    return drops
      .filter(
        (drop: Drop) =>
          outcomesFilter.length === 0 || outcomesFilter.includes(drop.outcome)
      )
      .filter(
        (drop: Drop) =>
          !event || (drop.event === event && (!area || drop.area === area))
      );
  };

  useEffect(() => {
    const newDrops = filterDrops(drops, outcomesFilter, event, area);
    const newFriendDrops = filterDrops(
      friendsData?.[0]?.drops,
      outcomesFilter,
      event,
      area
    );

    setFilteredDrops(newDrops);
    setFilteredFriendData(newFriendDrops);
    setMaxDropsLength(Math.max(newDrops.length, newFriendDrops.length));
  }, [event, area, drops, outcomesFilter]);

  return (
    <Box>
      <Button
        variant="contained"
        onClick={() => setIsDropFilterOpen((preFilterOpen) => !preFilterOpen)}
        startIcon={<FilterListIcon />}
      >
        絞り込み
      </Button>
      <Button
        variant="contained"
        onClick={() => setIsColumnFilterOpen((preFilterOpen) => !preFilterOpen)}
      >
        フィルタ
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setEditId(null);
          setIsEdit((preIsEdit) => !preIsEdit);
        }}
      >
        編集
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
      <Collapse in={isDropFilterOpen}>
        <Box pt={2}>
          <DropFilter
            event={event}
            area={area}
            eventsAreas={eventsAreas}
            outcomes={outcomes}
            outcomesFilter={outcomesFilter}
            handleEventChange={(_, newValue) => {
              setEvent(newValue ?? '');
              setArea('');
            }}
            handleAreaChange={(_, newValue) => setArea(newValue ?? '')}
            handleOutcomesFilter={handleOutcomesFilter}
          />
        </Box>
      </Collapse>
      <Box pt={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columnFilter.event && <TableCell>イベント</TableCell>}
                {columnFilter.area && <TableCell>海域</TableCell>}
                {columnFilter.outcome && <TableCell>勝利</TableCell>}
                {columnFilter.ship && (
                  <TableCell colSpan={friendsData.length + 1}>
                    ドロップ
                  </TableCell>
                )}
                {columnFilter.comment && <TableCell>コメント</TableCell>}
                {columnFilter.time && <TableCell>時間</TableCell>}
                {isEdit && <TableCell>編集</TableCell>}
              </TableRow>
              {friendsData.length > 0 && (
                <TableRow>
                  {columnFilter.event && <TableCell></TableCell>}
                  {columnFilter.area && <TableCell></TableCell>}
                  {columnFilter.outcome && <TableCell></TableCell>}
                  {columnFilter.ship && <TableCell>自分</TableCell>}
                  {columnFilter.ship && (
                    <TableCell>{friendsData?.[0]?.profile.name}</TableCell>
                  )}
                  {columnFilter.comment && <TableCell></TableCell>}
                  {columnFilter.time && <TableCell></TableCell>}
                  {isEdit && <TableCell></TableCell>}
                </TableRow>
              )}
            </TableHead>
            <TableBody>
              {Array.from({ length: maxDropsLength }, (_, index) => {
                const drop = filteredDrops[index];
                const time = drop
                  ? new Date(drop.time).toLocaleString('jp-JP', {
                      timeZone: 'Asia/Tokyo',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : undefined;

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
                  <TableRow key={drop?.id ?? filteredFriendData[index]?.id}>
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
                    {columnFilter.ship && friendsData.length > 0 && (
                      <TableCell>
                        <ShipInfo ship={filteredFriendData?.[index]?.ship} />
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
