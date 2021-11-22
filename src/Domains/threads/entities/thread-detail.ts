import { CommentDetail } from '../../comments/entities/comment-detail';
import { threadDetailErrors } from './constant/thread-detail-errors';

export interface ThreadDetailPayload {
  id: string;
  title: string;
  body: string;
  date: Date;
  username: string;
  comments: CommentDetail[];
}

export class ThreadDetail {
  id: string;

  title: string;

  body: string;

  date: Date;

  username: string;

  comments: CommentDetail[];

  constructor(payload: ThreadDetailPayload) {
    this.verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.date = payload.date;
    this.username = payload.username;
    this.comments = payload.comments;
  }

  verifyPayload(payload: ThreadDetailPayload) {
    const { id, title, body, username, comments, date } = payload;

    if (!id || !title || !body || !username || !comments || !date) {
      throw new Error(threadDetailErrors.NOT_CONTAIN_NEEDED_PROPERTY);
    }

    if (
      typeof id !== 'string' ||
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof username !== 'string' ||
      !Array.isArray(comments) ||
      !(date instanceof Date)
    ) {
      throw new Error(threadDetailErrors.NOT_MEET_DATA_TYPE_SPECIFICATION);
    }
  }
}
