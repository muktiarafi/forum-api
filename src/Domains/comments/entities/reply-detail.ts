import { replyDetailErrors } from './constant/reply-detail-errors';

export interface ReplyDetailPayload {
  id: string;
  content: string;
  date: string;
  username: string;
  isDelete: boolean;
}

export class ReplyDetail {
  id: string;

  content: string;

  date: string;

  username: string;

  constructor(payload: ReplyDetailPayload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.isDelete ? '**balasan telah dihapus**' : payload.content;

    this.date = payload.date;
    this.username = payload.username;
  }

  verifyPayload(payload: ReplyDetailPayload) {
    const { id, content, date, username } = payload;

    if (!id || !content || !date || !username) {
      throw new Error(replyDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string'
    ) {
      throw new Error(replyDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
