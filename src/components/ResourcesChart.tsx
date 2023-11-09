import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-moment';
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
  TimeScale,
  Legend
);

const options = {
  responsive: true,
  animation: {
    duration: 0,
  },
  scales: {
    x: {
      type: 'time' as const,
      time: {
        unit: 'day' as const,
        parser: 'MM-DD' as const,
      } as const,
    },
    left: {
      position: 'left' as const,
    },
    right: {
      position: 'right' as const,
    },
    screw: {
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
      { label: '燃料', field: 'fuel', color: [65, 117, 5] },
      { label: '弾薬', field: 'ammo', color: [139, 87, 42] },
      { label: '鋼材', field: 'steel', color: [155, 155, 155] },
      { label: 'ボーキ', field: 'bauxite', color: [245, 166, 35] },
      { label: 'バケツ', field: 'bucket', color: [126, 211, 33] },
      { label: '釘', field: 'nail', color: [50, 50, 100] },
      { label: 'ねじ', field: 'screw', color: [100, 100, 100] },
    ];
    const newData = {
      labels: resources.map((resource) => formatTime(resource.time) ?? ''),
      datasets: dataLabels.map(({ label, field, color }) => ({
        label: label,
        data: resources.map(
          (resource) => (resource[field as keyof Resource] as number) ?? null
        ),
        xAxisID: 'x',
        yAxisID:
          label === '燃料' ||
          label === '弾薬' ||
          label === '鋼材' ||
          label === 'ボーキ'
            ? 'left'
            : label === 'ねじ'
            ? 'screw'
            : 'right',
        borderColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.5)`,
      })),
    };
    setData(newData);
  }, [resources]);

  return <>{data && <Line data={data} options={options} />}</>;
};

const NamedResourcesChart = memo(ResourcesChart);
export default NamedResourcesChart;
