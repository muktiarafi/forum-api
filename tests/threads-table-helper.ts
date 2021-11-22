/* istanbul ignore file */
import { pool } from '../src/Infrastructures/database/postgres/pool';

interface Thread {
  id: string;
  title?: string;
  body?: string;
  userId: string;
}

export class ThreadsTableHelper {
  static async addThread({ id = 'thread-1', title = 'title', body = 'body', userId }: Thread) {
    const query = {
      text: `INSERT INTO threads (id, title, body, user_id)
            VALUES ($1, $2, $3, $4)`,
      values: [id, title, body, userId],
    };

    await pool.query(query);
  }

  static async findThread(id: string) {
    const query = {
      text: 'SELECT FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows;
  }

  static async cleanTable() {
    await pool.query('DELETE FROM threads');
  }
}
