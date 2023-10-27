import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

import { createDrop } from './createDrop';
import { createEventsAreas } from './createEventsAreas';
import { createFriend } from './createFriend';
import { createProfile } from './createProfile';
import { deleteDrop } from './deleteDrop';
import { deleteEventsAreas } from './deleteEventsAreas';
import { getDrops } from './getDrops';
import { getEventsAreas } from './getEventsAreas';
import { getFriends } from './getFriends';
import { getProfile } from './getProfile';
import { Drop, DropRequest, Profile } from './types';
import { updateDrop } from './updateDrop';

export class ApiClient {
  constructor(private user: User | null, private firestore: Firestore) {}

  async createDrop(drop: DropRequest): Promise<Drop | null> {
    return createDrop(this.user, this.firestore, drop);
  }
  async getDrops(userId?: string): Promise<Drop[]> {
    return getDrops(this.user, this.firestore, userId);
  }
  async updateDrop(dropId: string, preDrop: Drop, nextDrop: Drop) {
    return updateDrop(this.user, this.firestore, dropId, preDrop, nextDrop);
  }
  async deleteDrop(dropId: string, event: string, area: string) {
    return deleteDrop(this.user, this.firestore, dropId, event, area);
  }

  async createEventsAreas(event: string, area: string) {
    return createEventsAreas(this.user, this.firestore, event, area);
  }
  async getEventsAreas() {
    return getEventsAreas(this.user, this.firestore);
  }
  async deleteEventsAreas(event: string, area: string) {
    return deleteEventsAreas(this.user, this.firestore, event, area);
  }

  async createFriend(friendId: string): Promise<Profile | null> {
    return createFriend(this.user, this.firestore, friendId);
  }
  async getFriends(): Promise<string[]> {
    return getFriends(this.user, this.firestore);
  }

  async createProfile(name: string, message: string) {
    return createProfile(this.user, this.firestore, name, message);
  }
  async getProfile(userId?: string): Promise<Profile | null> {
    return getProfile(this.user, this.firestore, userId);
  }
}
