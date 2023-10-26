import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

import { createDrop } from './createDrop';
import { deleteDrop } from './deleteDrop';
import { getDrops } from './getDrops';
import { Drop, DropRequest } from './types';
import { updateDrop } from './updateDrop';

export class ApiClient {
  constructor(private user: User | null, private firestore: Firestore) {}

  async createDrop(drop: DropRequest): Promise<Drop | null> {
    return createDrop(this.user, this.firestore, drop);
  }
  async getDrops(): Promise<Drop[]> {
    return getDrops(this.user, this.firestore);
  }
  async updateDrop(dropId: string, preDrop: Drop, nextDrop: Drop) {
    return updateDrop(this.user, this.firestore, dropId, preDrop, nextDrop);
  }
  async deleteDrop(dropId: string, event: string, area: string) {
    return deleteDrop(this.user, this.firestore, dropId, event, area);
  }
}
