import { inject, injectable } from 'inversify';
import { Pool } from 'pg';
import { InvariantError } from '../../Commons/exceptions/invariant-error';
import { AuthenticationRepository } from '../../Domains/authentications/authentication-repository';
import TYPES from '../types';

@injectable()
export class AuthenticationRepositoryPostgres implements AuthenticationRepository {
  constructor(@inject(TYPES.Pool) public pool: Pool) {}

  async addToken(token: string) {
    const query = {
      text: 'INSERT INTO authentications VALUES ($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async checkAvailabilityToken(token: string) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this.pool.query(query);

    if (result.rows.length === 0) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteToken(token: string) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}
