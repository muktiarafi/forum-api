import { newThreadErrors } from './constant/new-thread-errors';

export interface NewThreadPayload {
  userId: string;
  title: string;
  body: string;
}

export class NewThread {
  readonly userId: string;

  readonly title: string;

  readonly body: string;

  constructor(payload: NewThreadPayload) {
    this.verifyPayload(payload);

    const { userId, title, body } = payload;

    this.userId = userId;
    this.title = title;
    this.body = body;
  }

  verifyPayload(payload: NewThreadPayload) {
    const { userId, title, body } = payload;

    if (!userId || !title || !body) {
      throw new Error(newThreadErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof userId !== 'string' || typeof title !== 'string' || typeof body !== 'string') {
      throw new Error(newThreadErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
