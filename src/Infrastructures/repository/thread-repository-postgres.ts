import { inject, injectable } from 'inversify';
import { Pool } from 'pg';
import { NotFoundError } from '../../Commons/exceptions/not-found-error';
import { AddedThread } from '../../Domains/threads/entities/added-thread';
import { NewThread } from '../../Domains/threads/entities/new-thread';
import { ThreadDetail } from '../../Domains/threads/entities/thread-detail';
import { ThreadRepository } from '../../Domains/threads/thread-repository';
import TYPES from '../types';

@injectable()
export class ThreadRepositoryPostgres implements ThreadRepository {
  constructor(@inject(TYPES.Pool) public pool: Pool, @inject(TYPES.IdGenerator) public idGenerator: () => string) {}

  async addThread(newThread: NewThread) {
    const { userId, title, body } = newThread;
    const threadId = `thread-${this.idGenerator()}`;

    const query = {
      text: `INSERT INTO threads (id, title, body, user_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, body, user_id AS owner`,
      values: [threadId, title, body, userId],
    };

    const result = await this.pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThread(threadId: string) {
    const query = {
      text: `SELECT t.id, title, body, date, username
      FROM threads AS t JOIN users AS u
      ON t.user_id = u.id
      WHERE t.id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Thread not found');
    }

    return new ThreadDetail({
      ...result.rows[0],
      comments: [],
    });
  }

  async isThreadAvailable(threadId: string) {
    const query = {
      text: `SELECT id FROM threads
      WHERE id = $1`,
      values: [threadId],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      throw new NotFoundError('Thread not found');
    }
  }
}
