import { pool } from '../src/Infrastructures/database/postgres/pool';

export class LikesTableHelper {
  static async addLike(userId: string, commentId: string) {
    const query = {
      text: `INSERT INTO likes (user_id, comment_id)
            VALUES ($1, $2)`,
      values: [userId, commentId],
    };

    await pool.query(query);
  }

  static async findLike(userId: string, commentId: string) {
    const query = {
      text: `SELECT COUNT(*)
          FROM likes
          WHERE user_id = $1 AND comment_id = $2`,
      values: [userId, commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  }

  static async cleanTable() {
    await pool.query('DELETE FROM likes');
  }
}
