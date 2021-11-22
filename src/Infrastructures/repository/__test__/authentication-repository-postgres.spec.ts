import { AuthenticationsTableTestHelper } from '../../../../tests/authentication-table-test-helper';
import { InvariantError } from '../../../Commons/exceptions/invariant-error';
import { pool } from '../../database/postgres/pool';
import { AuthenticationRepositoryPostgres } from '../authentication-repository-postgres';

describe('AuthenticationRepository postgres', () => {
  describe('addToken function', () => {
    it('should persist token', async () => {
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'refreshToken';

      await authenticationRepository.addToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toEqual(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = 'refreshToken';

      await expect(authenticationRepository.checkAvailabilityToken(token)).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if token is available', async () => {
      const token = 'refreshToken';
      await AuthenticationsTableTestHelper.addToken(token);
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);

      await expect(authenticationRepository.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      const token = 'refreshToken';
      await AuthenticationsTableTestHelper.addToken(token);
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);

      await authenticationRepository.deleteToken(token);

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(0);
    });
  });
});
