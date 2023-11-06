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
  const dataLabels = [
    ['燃料', 'fuel'],
    ['弾薬', 'ammo'],
    ['鋼材', 'steel'],
    ['ボーキ', 'bauxite'],
    ['バケツ', 'bucket'],
    ['釘', 'nail'],
    ['ねじ', 'screw'],
  ];

  useEffect(() => {
    const reversedResources = resources.slice().reverse();
    const data = {
      labels: reversedResources.map(
        (resource) => formatTime(resource.time) ?? ''
      ),
      datasets: dataLabels.map(([label, field]) => ({
        label: label,
        data: reversedResources.map(
          (resource) => (resource[field as keyof Resource] as number) ?? null
        ),
      })),
    };
    setData(data);
  }, [resources, dataLabels]);

  return <>{data && <Line data={data} options={options} />}</>;
};

const NamedResourcesChart = memo(ResourcesChart);
export default NamedResourcesChart;
