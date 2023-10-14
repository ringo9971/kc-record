import { createEventsAreas } from './createEventsAreas';
import { deleteEventsAreas } from './deleteEventsAreas';
import { getDrops } from './getDrops';
import { Drop } from './types';

export const updateDrop = async (
  dropId: string,
  preDrop: Drop,
  newDrop: Drop
) => {
  const drops = await getDrops();
  if (!drops) return;

  await deleteEventsAreas(preDrop.event, preDrop.area);
  await createEventsAreas(newDrop.event, newDrop.area);
  const newDrops = drops?.results.map((drop: Drop) => {
    if (drop.id === dropId) {
      return newDrop;
    }
    return drop;
  });
  localStorage.setItem('drops', JSON.stringify(newDrops));
};
