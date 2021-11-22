/* istanbul ignore file */
import { pool } from '../src/Infrastructures/database/postgres/pool';

interface User {
  id: string;
  username?: string;
  password?: string;
  fullname?: string;
}

export class UsersTableTestHelper {
  static async addUser({ id, username = 'bambank', password = 'secret', fullname = 'buambank' }: User) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname],
    };

    await pool.query(query);
  }

  static async findUsersById(id: string) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  }

  static async cleanTable() {
    await pool.query('DELETE FROM users');
  }
}
