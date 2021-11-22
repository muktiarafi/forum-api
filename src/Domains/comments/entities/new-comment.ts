import { newCommentErrors } from './constant/new-comment-errors';

export interface NewCommentPayload {
  threadId: string;
  userId: string;
  content: string;
}

export class NewComment {
  readonly threadId: string;

  readonly userId: string;

  readonly content: string;

  constructor(payload: NewCommentPayload) {
    this.verifyPayload(payload);

    const { threadId, userId, content } = payload;

    this.threadId = threadId;
    this.userId = userId;
    this.content = content;
  }

  verifyPayload(payload: NewCommentPayload) {
    const { threadId, userId, content } = payload;

    if (!threadId || !userId || !content) {
      throw new Error(newCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof threadId !== 'string' || typeof userId !== 'string' || typeof content !== 'string') {
      throw new Error(newCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
