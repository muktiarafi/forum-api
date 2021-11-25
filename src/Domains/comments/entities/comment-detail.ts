import { commentDetailErrors } from './constant/comment-detail-errors';
import { ReplyDetail } from './reply-detail';

export interface CommentDetailPayload {
  id: string;
  content: string;
  username: string;
  date: string;
  likeCount: number;
  replies: ReplyDetail[];
  isDelete: boolean;
}

export class CommentDetail {
  readonly id: string;

  readonly content: string;

  readonly username: string;

  readonly date: string;

  readonly likeCount: number;

  readonly replies: ReplyDetail[];

  constructor(payload: CommentDetailPayload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.isDelete ? '**komentar telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.likeCount = payload.likeCount;
    this.replies = payload.replies;
  }

  verifyPayload(payload: CommentDetailPayload) {
    const { id, content, date, username, likeCount, replies } = payload;

    if (!id || !content || !date || !username || likeCount === undefined || !replies) {
      throw new Error(commentDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof date !== 'string' ||
      typeof username !== 'string' ||
      typeof likeCount !== 'number' ||
      !Array.isArray(replies)
    ) {
      throw new Error(commentDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
