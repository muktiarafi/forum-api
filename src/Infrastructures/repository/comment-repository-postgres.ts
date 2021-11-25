import { inject, injectable } from 'inversify';
import { Pool } from 'pg';

import { ForbiddenError } from '../../Commons/exceptions/forbidden-error';
import { NotFoundError } from '../../Commons/exceptions/not-found-error';
import { CommentRepository } from '../../Domains/comments/comment-repository';
import { AddedComment } from '../../Domains/comments/entities/added-comment';
import { CommentDetail } from '../../Domains/comments/entities/comment-detail';
import { NewComment } from '../../Domains/comments/entities/new-comment';
import { NewReply } from '../../Domains/comments/entities/new-reply';
import { ReplyDetail } from '../../Domains/comments/entities/reply-detail';
import TYPES from '../types';

interface CommentRow {
  comment: {
    id: string;
    content: string;
    username: string;
    date: string;
    isDelete: boolean;
    likeCount: number;
    replies: Reply[];
  };
}

interface Reply {
  id: string;
  content: string;
  username: string;
  date: string;
  isDelete: boolean;
}

@injectable()
export class CommentRepositoryPostgres implements CommentRepository {
  constructor(@inject(TYPES.Pool) public pool: Pool, @inject(TYPES.IdGenerator) public idGenerator: () => string) {}

  async addComment(newComment: NewComment) {
    const { userId, threadId, content } = newComment;
    const id = `comment-${this.idGenerator()}`;

    const query = {
      text: `INSERT INTO comments (id, content, thread_id, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, content, user_id AS owner`,
      values: [id, content, threadId, userId],
    };

    const result = await this.pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async addReply(newReply: NewReply) {
    const { userId, threadId, parentId, content } = newReply;
    const id = `reply-${this.idGenerator()}`;

    const query = {
      text: `INSERT INTO comments (id, content, thread_id, parent_id, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, content, user_id AS owner`,
      values: [id, content, threadId, parentId, userId],
    };

    const result = await this.pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentsByThreadId(threadId: string): Promise<CommentDetail[]> {
    const query = {
      text: `SELECT json_build_object(
        'id', c.id, 
        'content', c.content, 
        'username', u1.username,
        'date', c.date, 
        'isDelete', c.is_delete, 
        'likeCount', (
          SELECT COUNT(*) FROM likes AS l
          WHERE l.comment_id = c.id
        ),
        'replies', COALESCE((SELECT json_agg(json_build_object(
            'id', r2.id, 
            'content', r2.content, 
            'username', r2.username,
            'date', r2.date,
            'isDelete', r2.is_delete))
        FROM (
          SELECT r.id, r.content, u2.username, r.date, r.is_delete 
          FROM comments AS r
          JOIN users AS u2
          ON r.user_id = u2.id
          WHERE r.parent_id = c.id
          ORDER BY r.date) AS r2), '[]'::json)) AS comment
    FROM comments AS c
    JOIN users AS u1
    ON c.user_id = u1.id
    WHERE c.thread_id = $1 AND c.parent_id IS NULL
    ORDER BY c.date`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    return (result.rows as CommentRow[]).map(
      (row) =>
        new CommentDetail({
          ...row.comment,
          replies: row.comment.replies.map((reply) => new ReplyDetail({ ...reply })),
        })
    );
  }

  async checkOwnership(userId: string, resourceId: string) {
    const query = {
      text: `SELECT user_id AS "userId" FROM comments
      WHERE id = $1`,
      values: [resourceId],
    };

    const result = await this.pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError('Resource not found');
    }

    const owner = result.rows[0].userId;
    if (owner !== userId) {
      throw new ForbiddenError('forbidden');
    }
  }

  async deleteComment(resourceId: string) {
    const query = {
      text: `UPDATE comments SET is_delete = $1
      WHERE id = $2`,
      values: [true, resourceId],
    };

    await this.pool.query(query);
  }

  async isCommentAvailable(commentId: string) {
    const query = {
      text: `SELECT id FROM comments
      WHERE id = $1`,
      values: [commentId],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('resource not found');
    }
  }

  async addLike(userId: string, commentId: string) {
    const query = {
      text: `INSERT INTO likes (user_id, comment_id)
      VALUES ($1, $2)`,
      values: [userId, commentId],
    };

    await this.pool.query(query);
  }

  async deleteLike(userId: string, commentId: string) {
    const query = {
      text: `DELETE FROM likes
      WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId],
    };

    await this.pool.query(query);
  }

  async isLiked(userId: string, commentId: string) {
    const query = {
      text: `SELECT user_id FROM likes
      WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId],
    };

    const result = await this.pool.query(query);

    return result.rows.length > 0;
  }
}
