import { Pool } from 'pg';
import { inject, injectable } from 'inversify';

import { InvariantError } from '../../Commons/exceptions/invariant-error';
import { RegisterUser } from '../../Domains/users/entities/register-user';
import { RegisteredUser } from '../../Domains/users/entities/registered-user';
import { UserRepository } from '../../Domains/users/user-repository';
import TYPES from '../types';

@injectable()
export class UserRepositoryPostgres implements UserRepository {
  constructor(@inject(TYPES.Pool) public pool: Pool, @inject(TYPES.IdGenerator) public idGenerator: () => string) {}

  async verifyAvailableUsername(username: string) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('username tidak tersedia');
    }
  }

  async addUser(registerUser: RegisterUser) {
    const { username, password, fullname } = registerUser;
    const id = `user-${this.idGenerator()}`;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id, username, fullname',
      values: [id, username, password, fullname],
    };

    const result = await this.pool.query(query);

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getUserByUsername(username: string) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User not found');
    }

    return new RegisteredUser({ ...result.rows[0] });
  }

  async getPasswordByUsername(username: string) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('User not found');
    }

    return result.rows[0].password;
  }
}
