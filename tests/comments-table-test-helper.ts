/* istanbul ignore file */
import { pool } from '../src/Infrastructures/database/postgres/pool';

interface Comment {
  id: string;
  content?: string;
  userId: string;
  threadId: string;
}

interface Reply {
  id: string;
  content?: string;
  userId: string;
  threadId: string;
  parentId: string;
}

export class CommentsTableTestHelper {
  static async addComment({ userId, threadId, id, content = 'ini komen' }: Comment) {
    const query = {
      text: `INSERT INTO comments (id, content, user_id, thread_id)
            VALUES ($1, $2, $3, $4)`,
      values: [id, content, userId, threadId],
    };

    await pool.query(query);
  }

  static async findComment(commentId: string) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  }

  static async addReply({ userId, threadId, parentId, id, content = 'ini reply' }: Reply) {
    const query = {
      text: `INSERT INTO comments (id, content, parent_id, user_id, thread_id)
            VALUES ($1, $2, $3, $4, $5)`,
      values: [id, content, parentId, userId, threadId],
    };

    await pool.query(query);
  }

  static async cleanTable() {
    await pool.query('DELETE FROM comments');
  }
}
