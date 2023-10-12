import { DropsResponse } from './types';

export const getDrops = async (): Promise<DropsResponse | null> => {
  const storedDrops = localStorage.getItem('drops');

  if (storedDrops) {
    return { results: JSON.parse(storedDrops) };
  }
  return null;
};
