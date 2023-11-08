import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { memo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { Resource } from '../api/types';
import { formatTime } from '../utils/helpers';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  animation: {
    duration: 0,
  },
  scales: {
    left: {
      position: 'left' as const,
    },
    right: {
      position: 'right' as const,
    },
  },
};

interface Data {
  labels: string[];
  datasets: Array<{
    label: string;
    data: (number | null)[];
  }>;
}

interface ResourceChartProps {
  resources: Resource[];
}

export const ResourcesChart = ({ resources }: ResourceChartProps) => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const dataLabels = [
      ['燃料', 'fuel'],
      ['弾薬', 'ammo'],
      ['鋼材', 'steel'],
      ['ボーキ', 'bauxite'],
      ['バケツ', 'bucket'],
      ['釘', 'nail'],
      ['ねじ', 'screw'],
    ];
    const newData = {
      labels: resources.map((resource) => formatTime(resource.time) ?? ''),
      datasets: dataLabels.map(([label, field]) => ({
        label: label,
        data: resources.map(
          (resource) => (resource[field as keyof Resource] as number) ?? null
        ),
        yAxisID:
          label === '燃料' ||
          label === '弾薬' ||
          label === '鋼材' ||
          label === 'ボーキ'
            ? 'left'
            : 'right',
      })),
    };
    setData(newData);
  }, [resources]);

  return <>{data && <Line data={data} options={options} />}</>;
};

const NamedResourcesChart = memo(ResourcesChart);
export default NamedResourcesChart;
