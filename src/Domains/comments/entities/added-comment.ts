import { addedCommentErrors } from './constant/added-comment-errors';

export interface AddedCommentPayload {
  id: string;
  content: string;
  owner: string;
}

export class AddedComment {
  readonly id: string;

  readonly content: string;

  readonly owner: string;

  constructor(payload: AddedCommentPayload) {
    this.verifyPayload(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  verifyPayload(payload: AddedCommentPayload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error(addedCommentErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error(addedCommentErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
