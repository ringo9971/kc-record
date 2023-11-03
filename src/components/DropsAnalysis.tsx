import {
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

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
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
  const { rareDrops, rareColors } = useRareContext();

  const [total, setTotal] = useState<number>(drops.length);
  const [reachRate, setReachRate] = useState<number | undefined>(undefined);
  const [sRate, setSRate] = useState<number | undefined>(undefined);
  const [dropRate, setDropRate] = useState<number | undefined>(undefined);
  const [rareRate, setRareRate] = useState<number | undefined>(undefined);
  const [data, setData] = useState<Data | undefined>(undefined);

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
          result[rarity] = (result[rarity] || 0) + 1;
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
      {data && <Bar data={data} options={options} />}
    </>
  );
};

const NamedDropsAnalysis = memo(DropsAnalysis);
export default NamedDropsAnalysis;
