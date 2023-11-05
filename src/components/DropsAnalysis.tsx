import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { memo, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

import { Drop, RareColor } from '../api/types';
import { useMasterContext } from '../lib/MasterContext';
import { useRareContext } from '../lib/RareContext';
import { displayRate } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getOptions = (title: string) => {
  return {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
};

interface DropsAnalysisProps {
  drops: Drop[];
}

interface Data {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string;
  }>;
}

export const DropsAnalysis = ({ drops }: DropsAnalysisProps) => {
  const { shipCountryMaster, shipTypeMaster } = useMasterContext();
  const { rareDrops, rareColors } = useRareContext();

  const [width, setWidth] = useState(window.innerWidth);

  const [total, setTotal] = useState<number>(drops.length);
  const [reachRate, setReachRate] = useState<number | undefined>(undefined);
  const [sRate, setSRate] = useState<number | undefined>(undefined);
  const [dropRate, setDropRate] = useState<number | undefined>(undefined);
  const [rareRate, setRareRate] = useState<number | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(undefined);
  const [count, setCount] = useState<Data | undefined>(undefined);
  const [country, setCountry] = useState<Data | undefined>(undefined);
  const [types, setTypes] = useState<Data | undefined>(undefined);

  useEffect(() => {
    const total = drops.length;
    setTotal(drops.length);

    const reachCount = drops.filter((drop) => drop.outcome !== '撤退').length;
    const sCount = drops.filter((drop) => drop.outcome === 'S').length;
    const dropCount = drops.filter((drop) => drop.ship).length;
    const rareCount = drops.filter((drop) => rareDrops.get(drop.ship)).length;

    setReachRate(reachCount / total);
    setSRate(sCount / total);
    setDropRate(dropCount / total);
    setRareRate(rareCount / total);
  }, [drops, rareDrops]);

  useEffect(() => {
    const count: Record<string, number> = drops.reduce(
      (result, drop) => {
        result[drop.ship] = (result[drop.ship] ?? 0) + 1;
        return result;
      },
      {} as Record<string, number>
    );

    const sortedCount = Object.entries(count)
      .filter(([drop]) => drop !== '' && drop !== '撤退' && drop !== 'ガシャン')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels = sortedCount.map(([ship]) => ship);
    const data = sortedCount.map(([, count]) => count);

    setCount({
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [drops]);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (drops.length === 0) return;

    const ids = Array.from(rareColors.keys());
    const colors = ids
      .map((id) => rareColors.get(id))
      .filter((color) => color !== undefined) as RareColor[];
    const labels = colors.map((color) => color.comment);

    const count: Record<string, number> = drops.reduce(
      (result, drop) => {
        const rarity = rareDrops.get(drop.ship);
        if (rarity) {
          result[rarity] = (result[rarity] ?? 0) + 1;
        }
        return result;
      },
      {} as Record<string, number>
    );
    const data = ids.map((id) => (count[id] / drops.length) * 100);

    setData({
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [drops, rareDrops, rareColors]);

  useEffect(() => {
    const labels = ['日', '米', '伊', '英', '独', '仏', 'ソ', '他'];

    const count: Record<string, number> = drops.reduce(
      (result, drop) => {
        const rarity = shipCountryMaster.get(drop.ship);
        if (rarity) {
          result[rarity] = (result[rarity] ?? 0) + 1;
        }
        return result;
      },
      {} as Record<string, number>
    );
    const data = labels.map((label) => count[label]);

    setCountry({
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [drops, shipCountryMaster]);

  useEffect(() => {
    const labels = [
      '駆逐',
      '軽巡',
      '重巡',
      '軽空',
      '空母',
      '戦艦',
      '水母',
      '海防',
      '潜水',
      'その他',
    ];

    const count: Record<string, number> = drops.reduce(
      (result, drop) => {
        const rarity = shipTypeMaster.get(drop.ship);
        if (rarity) {
          result[rarity] = (result[rarity] ?? 0) + 1;
        }
        return result;
      },
      {} as Record<string, number>
    );
    const data = labels.map((label) => count[label]);

    setTypes({
      labels,
      datasets: [
        {
          data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    });
  }, [drops, shipTypeMaster]);

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>回数</TableCell>
              <TableCell>到達率</TableCell>
              <TableCell>S 率</TableCell>
              <TableCell>ドロ率</TableCell>
              <TableCell>レア率</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{total}</TableCell>
              <TableCell>{displayRate(reachRate)}</TableCell>
              <TableCell>{displayRate(sRate)}</TableCell>
              <TableCell>{displayRate(dropRate)}</TableCell>
              <TableCell>{displayRate(rareRate)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        display="flex"
        flexDirection={width < 800 ? 'column' : 'row'}
        sx={{
          gap: 2,
          mt: 2,
        }}
      >
        {data && (
          <Box
            sx={{
              width: width < 800 ? '100%' : '50%',
            }}
          >
            <Bar
              data={data}
              options={getOptions('レアドロップ')}
              style={{
                marginBottom: 2,
              }}
            />
          </Box>
        )}
        {count && (
          <Box
            sx={{
              width: width < 800 ? '100%' : '50%',
            }}
          >
            <Bar
              data={count}
              options={getOptions('ドロップ別')}
              style={{
                marginBottom: 2,
              }}
            />
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection={width < 800 ? 'column' : 'row'}
        sx={{
          gap: 2,
          mt: 2,
        }}
      >
        {types && (
          <Box
            sx={{
              width: width < 800 ? '100%' : '50%',
            }}
          >
            <Bar
              data={types}
              options={getOptions('種別')}
              style={{
                marginBottom: 2,
              }}
            />
          </Box>
        )}
        {country && (
          <Box
            sx={{
              width: width < 800 ? '100%' : '50%',
            }}
          >
            <Bar
              data={country}
              options={getOptions('国別')}
              style={{
                marginBottom: 2,
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

const NamedDropsAnalysis = memo(DropsAnalysis);
export default NamedDropsAnalysis;
