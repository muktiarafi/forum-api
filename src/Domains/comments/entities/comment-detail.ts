import { commentDetailErrors } from './constant/comment-detail-errors';
import { ReplyDetail } from './reply-detail';

export interface CommentDetailPayload {
  id: string;
  content: string;
  username: string;
  date: string;
  replies: ReplyDetail[];
  isDelete: boolean;
}

export class CommentDetail {
  id: string;

  content: string;

  username: string;

  date: string;

  replies: ReplyDetail[];

  constructor(payload: CommentDetailPayload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.isDelete ? '**komentar telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.replies = payload.replies;
  }

  verifyPayload(payload: CommentDetailPayload) {
    const { id, content, date, username, replies } = payload;

    if (!id || !content || !date || !username || !replies) {
      throw new Error(commentDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(replies)
    ) {
      throw new Error(commentDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
