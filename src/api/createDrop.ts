import { v4 as uuidv4 } from 'uuid';

import { createEventsAreas } from './createEventsAreas';
import { getDrops } from './getDrops';
import { DropRequest } from './types';

export const createDrop = async (drop: DropRequest) => {
  if(!drop.event || !drop.area) return;

  const newDrop = {
    id: uuidv4(),
    time: new Date(),
    ...drop,
  };

  await createEventsAreas(drop.event, drop.area);
  const drops = await getDrops();

  if (drops) {
    const newDrops = [newDrop, ...drops.results];
    localStorage.setItem('drops', JSON.stringify(newDrops));
  } else {
    localStorage.setItem('drops', JSON.stringify([newDrop]));
  }
};
