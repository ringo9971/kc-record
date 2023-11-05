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
    const labels = resources.map((resource) => formatTime(resource.time) ?? '');
    const fuels = resources.map((resource) => resource.fuel);
    const ammos = resources.map((resource) => resource.ammo);
    const steels = resources.map((resource) => resource.steel);
    const bauxites = resources.map((resource) => resource.bauxite ?? null);
    const buckets = resources.map((resource) => resource.bucket ?? null);
    const nails = resources.map((resource) => resource.nail ?? null);
    const screws = resources.map((resource) => resource.screw ?? null);

    const data = {
      labels,
      datasets: [
        { label: '燃料', data: fuels },
        { label: '弾薬', data: ammos },
        { label: '鋼材', data: steels },
        { label: 'ボーキ', data: bauxites },
        { label: 'バケツ', data: buckets },
        { label: '釘', data: nails },
        { label: 'ねじ', data: screws },
      ],
    };
    setData(data);
  }, [resources]);

  return <>{data && <Line data={data} options={options} />}</>;
};

const NamedResourcesChart = memo(ResourcesChart);
export default NamedResourcesChart;
