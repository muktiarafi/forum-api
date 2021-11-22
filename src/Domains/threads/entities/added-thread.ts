import { addedThreadErrors } from './constant/added-thread-errors';

export interface AddedThreadPayload {
  id: string;
  title: string;
  owner: string;
}

export class AddedThread {
  readonly id: string;

  readonly title: string;

  readonly owner: string;

  constructor(payload: AddedThreadPayload) {
    this.verifyPayload(payload);

    const { id, title, owner } = payload;
    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  verifyPayload(payload: AddedThreadPayload) {
    const { id, title, owner } = payload;

    if (!id || !title || !owner) {
      throw new Error(addedThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error(addedThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
