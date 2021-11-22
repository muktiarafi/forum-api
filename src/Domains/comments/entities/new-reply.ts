import { newReplyErrors } from './constant/new-reply-errors';

export interface NewReplyPayload {
  userId: string;
  threadId: string;
  parentId: string;
  content: string;
}

export class NewReply {
  readonly userId: string;

  readonly threadId: string;

  readonly parentId: string;

  readonly content: string;

  constructor(payload: NewReplyPayload) {
    this.verifyPayload(payload);

    const { userId, threadId, parentId, content } = payload;

    this.userId = userId;
    this.threadId = threadId;
    this.parentId = parentId;
    this.content = content;
  }

  verifyPayload(payload: NewReplyPayload) {
    const { userId, threadId, parentId, content } = payload;

    if (!userId || !threadId || !parentId || !content) {
      throw new Error(newReplyErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (
      typeof userId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof parentId !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error(newReplyErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
