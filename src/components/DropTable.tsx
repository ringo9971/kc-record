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

import { Drop } from '../api/types';
import { updateDrop } from '../api/updateDrop';

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
  eventsAreas: Map<string, string[]>;
  fetchEventsAreas: () => void;
}

interface ShowFilter {
  event: boolean;
  area: boolean;
  outcome: boolean;
  ship: boolean;
  comment: boolean;
  time: boolean;
}

export const DropTable = (props: DropsItemConfig): JSX.Element => {
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

  const [isDropFilterOpen, setIsDropFilterOpen] = useState(false);
  const [items, setItems] = useState<Drop[]>(props.items ?? []);
  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');

  const outcomes = ['S', 'A', 'B', '撤退', '不明'];
  const [outcomesFilter, setOutcomesFilter] = useState<string[]>([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [dropEdit, setDropEdit] = useState<Drop>({
    id: '',
    time: '',
    event: '',
    area: '',
    outcome: '',
    ship: '',
    comment: '',
  });

  const handleUpdateDrop = (dropId: string, preDrop: Drop, newDrop: Drop) => {
    if (!newDrop.event || !newDrop.area) return;
    updateDrop(dropId, preDrop, newDrop);
    setItems((preItems) =>
      preItems.map((item) => {
        if (item.id === dropId) return newDrop;
        return item;
      })
    );
    setEditId(null);
    props.fetchEventsAreas();
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

  useEffect(() => {
    const newItems = (props.items ?? [])
      .filter(
        (item: Drop) =>
          outcomesFilter.length === 0 || outcomesFilter.includes(item.outcome)
      )
      .filter(
        (item: Drop) =>
          !event || (item.event === event && (!area || item.area === area))
      );

    setItems(newItems);
  }, [event, area, props.items, outcomesFilter]);

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
      <Box>
        <Collapse in={isDropFilterOpen}>
          <Box pt={2}>
            <Box display="flex" flexDirection="row">
              <Autocomplete
                options={['', ...Array.from(props.eventsAreas.keys())]}
                getOptionLabel={(event: string) => event}
                onOpen={props.fetchEventsAreas}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="イベント"
                    placeholder="イベント"
                    size="small"
                  />
                )}
                value={event}
                onChange={(_, newValue) => {
                  setEvent(newValue ?? '');
                  setArea('');
                }}
              />
              <Autocomplete
                options={['', ...(props.eventsAreas.get(event) ?? [])]}
                getOptionLabel={(area: string) => area}
                sx={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="海域"
                    placeholder="海域"
                    size="small"
                  />
                )}
                value={area}
                onChange={(_, newValue) => setArea(newValue ?? '')}
              />
            </Box>
            <FormGroup sx={{ direction: 'flex', flexDirection: 'row', pt: 2 }}>
              {outcomes.map((outcome) => (
                <FormControlLabel
                  key={outcome}
                  control={
                    <Checkbox
                      checked={outcomesFilter.includes(outcome)}
                      onChange={() => handleOutcomesFilter(outcome)}
                    />
                  }
                  label={outcome}
                  labelPlacement="top"
                />
              ))}
            </FormGroup>
          </Box>
        </Collapse>
      </Box>
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
                {isEdit && <TableCell>編集</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((drop) => {
                const time = new Date(drop.time).toLocaleString('jp-JP', {
                  timeZone: 'Asia/Tokyo',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                });

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
                    {editId && editId === drop.id ? (
                      <Autocomplete
                        value={editValue}
                        inputValue={editValue}
                        onInputChange={onChangeFn}
                        options={options}
                        getOptionLabel={(value: string) => value}
                        sx={{ width: 100 }}
                        onOpen={props.fetchEventsAreas}
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
                    {editId && editId === drop.id ? (
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
                  <TableRow key={drop.id}>
                    {columnFilter.event &&
                      renderAutocompleteCell(
                        dropEdit.event,
                        drop.event,
                        Array.from(props.eventsAreas.keys()),
                        (_, event) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            event: event,
                          }))
                      )}
                    {columnFilter.area &&
                      renderAutocompleteCell(
                        dropEdit.area,
                        drop.area,
                        props.eventsAreas.get(dropEdit.event) ?? [],
                        (_, area) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            area: area,
                          }))
                      )}
                    {columnFilter.outcome && (
                      <TableCell>
                        {editId && editId === drop.id ? (
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
                            onOpen={props.fetchEventsAreas}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        ) : (
                          <>{drop.outcome}</>
                        )}
                      </TableCell>
                    )}
                    {columnFilter.ship &&
                      renderTextFiledCell(
                        dropEdit.ship,
                        drop.ship,
                        (e: React.ChangeEvent<HTMLInputElement>) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            ship: e.target.value,
                          }))
                      )}
                    {columnFilter.comment &&
                      renderTextFiledCell(
                        dropEdit.comment,
                        drop.comment,
                        (e: React.ChangeEvent<HTMLInputElement>) =>
                          setDropEdit((preDropEdit) => ({
                            ...preDropEdit,
                            comment: e.target.value,
                          }))
                      )}
                    {columnFilter.time && <TableCell>{time}</TableCell>}
                    {isEdit && (
                      <TableCell>
                        {editId && editId === drop.id ? (
                          <Button
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
