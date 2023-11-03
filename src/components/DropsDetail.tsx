import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Modal,
} from '@mui/material';
import { memo, useEffect, useState } from 'react';

import DeleteDropDialog from './DeleteDropDialog';
import DropFilter from './DropFilter';
import DropsAnalysis from './DropsAnalysis';
import DropsTable from './DropsTable';
import { Drop } from '../api/types';
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

interface DropsDetailProps {
  drops: Drop[];
  outcomes: string[];
  eventsAreas: Map<string, string[]>;
}

export interface ShowFilter {
  event: boolean;
  area: boolean;
  outcome: boolean;
  ship: boolean;
  comment: boolean;
  time: boolean;
}

export const DropsDetail = ({
  drops,
  outcomes,
  eventsAreas,
}: DropsDetailProps): JSX.Element => {
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

  const { deleteDrop } = useDropsContext();
  const [isDropFilterOpen, setIsDropFilterOpen] = useState(false);
  const [filteredDrops, setFilteredDrops] = useState<Drop[]>(drops);
  const [event, setEvent] = useState('');
  const [area, setArea] = useState('');

  const [outcomesFilter, setOutcomesFilter] = useState<string[]>([]);

  const [isEdit, setIsEdit] = useState(false);

  const [deleteDropShip, setDeleteDropShip] = useState<Drop | null>(null);
  const deleteDropOpen = Boolean(deleteDropShip);

  const handleDeleteDrop = () => {
    if (!deleteDropShip) return;
    deleteDrop(deleteDropShip.id);
    setDeleteDropShip(null);
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
  }, [event, area, drops, outcomesFilter, friendsData]);

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
        onClick={() => setIsEdit((preIsEdit) => !preIsEdit)}
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
        <DropsAnalysis drops={filteredDrops} />
        <DropsTable
          drops={filteredDrops}
          friendDrops={filteredFriendData}
          friendData={friendsData?.[0]}
          outcomes={outcomes}
          eventsAreas={eventsAreas}
          columnFilter={columnFilter}
          isEdit={isEdit}
          setFilteredDrops={setFilteredDrops}
          setDeleteDropShip={setDeleteDropShip}
        />
      </Box>
      <DeleteDropDialog
        open={deleteDropOpen}
        drop={deleteDropShip}
        onClose={() => setDeleteDropShip(null)}
        onCanselClick={() => setDeleteDropShip(null)}
        onDeleteClick={handleDeleteDrop}
      />
    </Box>
  );
};

const NamedDropDetail = memo(DropsDetail);
export default NamedDropDetail;
